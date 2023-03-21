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
  PermissionFlagsBits,
} from 'discord.js';
import { User } from 'src/user/user.entity';
import { difference } from 'lodash';
import { IsModalInteractionGuard } from '../guards/is-modal-interaction.guard';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

const DISCORD_AUTH_ROLE_NAME = 'Authed';
const DISCORD_AUTH_CHANNEL_NAME = 'authentication';
const DISCORD_NAME_ATTEMPTS = 10;
const DISCORD_TOS_AGREEMENT = 'agree';
@Command({
  name: 'registration',
  description: 'Create TaT account',
  defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
})
export class RegisterCommand {
  private readonly logger = new Logger(RegisterCommand.name);
  private readonly requestParticipantModalId = 'RequestParticipant';
  private readonly commentComponentId = 'comment';

  constructor(
    private configService: ConfigService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  // async getNickname(nickname: string) {
  //   for (let prefix = 0; prefix < DISCORD_NAME_ATTEMPTS; prefix++) {
  //     if (! await this.usersRepository.findOne({ where: { nickname: nickname + prefix } })) {

  //       return nickname + prefix;
  //     }
  //   }
  //   return;
  // }

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
      .setLabel(`type "Agree" to confirm agreement with rules`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Agree');

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
    // https://discord.gg/VT6grnfD6t
    const [modal] = eventArgs;
    if (!modal.isModalSubmit()) return;
    if (modal.customId !== this.requestParticipantModalId) return;
    if (modal.channel.name !== DISCORD_AUTH_CHANNEL_NAME) {
      await modal.reply({ content: 'Wrong channel', ephemeral: true });
      return;
    }

    const comment = modal['fields'].fields.get(this.commentComponentId).value;
    if (comment.toLowerCase() !== DISCORD_TOS_AGREEMENT) {
      await modal.reply({
        content: 'TaT requires users to comply with the rules provided',
        ephemeral: true,
      });
      return;
    }

    this.logger.log(`Modal ${modal.customId} submit`);

    const discUser = await this.client.users.fetch(modal.user.id);
    const hash = uuidv4();
    let siteUserNickname = discUser.username
      .toLowerCase()
      .match(/[a-zA-Z0-9]+/g)
      .toString()
      .split(',')
      .join('');

    // if (siteUserNickname.length < 3) {
    //   const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    //   siteUserNickname = '';
    //   for (let index = 0; index < 10; index++) {
    //     siteUserNickname += alphabet.charAt(
    //       Math.floor(Math.random() * alphabet.length),
    //     );
    //   }
    // }
    if (siteUserNickname.length < 4) {
      siteUserNickname = new Date().getTime().toString();
    }

    const discCheck = await this.usersRepository.findOne({
      where: {
        discordId: discUser.id,
      },
    });
    if (discCheck?.discordId === discUser.id) {
      await modal.reply({
        content: 'discord ID is already registered',
        ephemeral: true,
      });
      return;
    }

    const names = [
      siteUserNickname,
      ...new Array(DISCORD_NAME_ATTEMPTS)
        .fill(1)
        .map((v, suffix) => `${siteUserNickname}${suffix}`),
    ];

    const existingNames = await this.usersRepository.findAll({
      where: {
        nickname: names,
      },
      raw: true,
      attributes: ['nickname'],
    });

    const diffName = difference(
      names,
      existingNames.map((user) => user.nickname),
    );

    if (!diffName?.length) {
      await modal.reply({
        content: 'Please file a form submit with a bug report stating NameGen',
        ephemeral: true,
      });
      return;
    } else if (diffName?.length) {
      siteUserNickname = diffName[0];
    }

    const hashCheck = await this.usersRepository.findOne({
      where: {
        hash,
      },
      attributes: ['hash'],
    });

    if (hashCheck?.hash === hash) {
      await modal.reply({ content: 'server error try again', ephemeral: true });
      return;
    }

    await this.usersRepository.create({
      nickname: siteUserNickname,
      discordId: discUser.id,
      hash,
      discord: discUser.username.toLowerCase() + '#' + discUser.discriminator,
      active: true,
    });
    //226347736
    try {
      modal.guild.members.cache
        .get(discUser.id)
        .roles.add(
          modal.guild.roles.cache.find(
            (r) => r.name === DISCORD_AUTH_ROLE_NAME,
          ),
        );
    } catch (error) {
      this.logger.log(`Modal ${modal.customId} ${error}`);
    }

    try {
      const discordMessage =
        `__${this.configService.get('APP_URL')}/signup?hash=${hash}__` +
        '\n' +
        `Your link to complete registration on **TaT**`;

      await discUser.send(discordMessage);
    } catch (error) {
      this.logger.log(`disc send ${error}`);
    }

    await modal.reply({
      content: this.configService.get('APP_URL') + `/signup?hash=${hash}`,
      ephemeral: true,
    });
  }
}
