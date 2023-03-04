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
import { Logger, UseGuards } from '@nestjs/common';
import {
  ActionRowBuilder,
  Client,
  ClientEvents,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  codeBlock,
} from 'discord.js';

import { IsModalInteractionGuard } from '../guards/is-modal-interaction.guard';
import { FormDto } from './dto/form.dto';

@Command({
  name: 'submit-registration',
  description: 'Apply for registration',
})
export class RegisterCommand {
  private readonly logger = new Logger(RegisterCommand.name);
  private readonly requestParticipantModalId = 'RequestParticipant';
  private readonly usernameComponentId = 'username';
  private readonly commentComponentId = 'comment';

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Handler()
  async onRegisterCommand(interaction: CommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setTitle('Request participation')
      .setCustomId(this.requestParticipantModalId);

    const userNameInputComponent = new TextInputBuilder()
      .setCustomId(this.usernameComponentId)
      .setLabel('Username on site')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(this.usernameComponentId);

    const commentInputComponent = new TextInputBuilder()
      .setCustomId(this.commentComponentId)
      .setLabel('Copy-paste from site')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(this.commentComponentId);

    const rows = [userNameInputComponent, commentInputComponent].map(
      (component) =>
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
    // console.log(eventArgs);
    const discordInfo = modal.user;
    //navern sanitize
    const username = modal['fields'].fields.get(this.usernameComponentId).value;

    //sanitize
    const comment = modal['fields'].fields.get(this.commentComponentId).value;

    if (!modal.isModalSubmit()) return;

    this.logger.log(`Modal ${modal.customId} submit`);

    if (modal.customId !== this.requestParticipantModalId) return;

    let response =
      codeBlock('markdown', comment) + codeBlock('markdown', username);

    if (username == 'test') {
      if (comment == 'tes3') {
        response = 'funny buisness';
      }
    }

    await modal.reply(response);
  }
}
