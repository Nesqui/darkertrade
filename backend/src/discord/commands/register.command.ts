import { ModalFieldsTransformPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  IA,
  InjectDiscordClient,
  On,
} from '@discord-nestjs/core';
import type { ModalActionRowComponentBuilder } from '@discordjs/builders';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  ActionRowBuilder,
  Client,
  ClientEvents,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  codeBlock,
  PermissionFlagsBits,
  InteractionReplyOptions,
} from 'discord.js';
import { User } from 'src/user/user.entity';

import { IsModalInteractionGuard } from '../guards/is-modal-interaction.guard';
import { FormDto } from './dto/form.dto';

const DISCORD_AUTH_ROLE_NAME = 'Authed';
const DISCORD_AUTH_CHANNEL_NAME = 'authentication';

@Command({
  name: 'submit-registration',
  description: 'Apply for registration',
  defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
})
export class RegisterCommand {
  private readonly logger = new Logger(RegisterCommand.name);
  private readonly requestParticipantModalId = 'RequestParticipant';
  private readonly commentComponentId = 'comment';

  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Handler()
  async onRegisterCommand(interaction: CommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setTitle('Request participation')
      .setCustomId(this.requestParticipantModalId);

    // const userNameInputComponent = new TextInputBuilder()
    // .setCustomId(this.usernameComponentId)
    // .setLabel('Username on site')
    // .setStyle(TextInputStyle.Short)
    // .setPlaceholder(this.usernameComponentId);

    const commentInputComponent = new TextInputBuilder()
      .setCustomId(this.commentComponentId)
      .setLabel('Copy-paste from site')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Your discord has to match the one on site');

    const rows = [commentInputComponent].map((component) =>
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        component,
      ),
    );

    modal.addComponents(...rows);
    await interaction.showModal(modal);
  }

  @On('interactionCreate')
  @UseGuards(IsModalInteractionGuard)
  async onModuleSubmit(
    // @IA(ModalFieldsTransformPipe) dto: FormDto,
    @EventParams() eventArgs: ClientEvents['interactionCreate'],
  ): Promise<void> {
    const [modal] = eventArgs;
    if (!modal.isModalSubmit()) return;
    if (modal.customId !== this.requestParticipantModalId) return;
    if (modal.channel.name !== DISCORD_AUTH_CHANNEL_NAME) return;

    const comment = modal['fields'].fields.get(this.commentComponentId).value;

    this.logger.log(`Modal ${modal.customId} submit`);

    const discUser = await this.client.users.fetch(modal.user.id);

    let modalResponse = 'mismatch of discord name';
    const responseDB = await this.usersRepository.findOne({
      where: { hash: comment },
    });
    if (responseDB) {
      if (
        responseDB.discord.toLowerCase() ===
        discUser.username.toLowerCase() + '#' + discUser.discriminator
      ) {
        modalResponse = 'form submit success, ';
        try {
          modal.guild.members.cache
            .get(discUser.id)
            .roles.add(
              modal.guild.roles.cache.find(
                (r) => r.name === DISCORD_AUTH_ROLE_NAME,
              ),
            );
          modalResponse += 'role assigned, ';
        } catch (error) {
          this.logger.log(`Modal ${modal.customId} ${error}`);
        }
        try {
          //   await this.usersRepository.update(
          //     {
          //       discordActive: true,
          //       hash: '',
          //       discordId: discUser.id,
          //     },
          //     {
          //       where: { hash: comment },
          //     },
          //   );
          responseDB.discordActive = true;
          responseDB.hash = '';
          responseDB.discordId = discUser.id;
          await responseDB.save();
          modalResponse += 'site access granted';
        } catch (error) {
          this.logger.log(`Modal ${modal.customId} DB ${error}`);
        }
      }
    }

    await modal.reply({ content: modalResponse, ephemeral: true });
  }
}
