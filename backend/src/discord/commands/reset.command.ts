import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  InjectDiscordClient,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  ClientEvents,
  InteractionReplyOptions,
  PermissionFlagsBits,
} from 'discord.js';
import { User } from 'src/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
@Command({
  name: 'reset',
  description: 'Reset the user authentication',
  defaultMemberPermissions: PermissionFlagsBits.UseApplicationCommands,
})
export class ResetCommand {
  constructor(
    private configService: ConfigService,
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Handler()
  async onResetCommand(
    @InteractionEvent(SlashCommandPipe) dto: any,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): Promise<void> {
    const discordId = dto.user.id;
    const discUser = await this.client.users.fetch(discordId);

    try {
      const user = await this.usersRepository.findOne({
        where: {
          discordId,
        },
      });

      if (!user) {
        // Отправлять ответ только пользователю, который выполнил команду
        const replyOptions: InteractionReplyOptions = {
          content:
            'Current user not found, please register first, or ask moderators to help (Xloctis or Nesqui).',
          ephemeral: true, // Сделать ответ видимым только для пользователя
        };
        dto.reply(replyOptions);
        return;
      }

      const hash = uuidv4();
      user.hash = hash;
      await user.save();

      const discordMessage =
        `__${this.configService.get('APP_URL')}/auth?hash=${hash}__` +
        '\n' +
        `Your link to reset user on **TaT**`;

      discUser.send(discordMessage);

      // Отправлять ответ только пользователю, который выполнил команду
      const replyOptions: InteractionReplyOptions = {
        content: 'Please check your dm',
        ephemeral: true, // Сделать ответ видимым только для пользователя
      };
      dto.reply(replyOptions);
    } catch (error) {
      // Отправлять ответ только пользователю, который выполнил команду
      const replyOptions: InteractionReplyOptions = {
        content: 'Please check your dm',
        ephemeral: true, // Сделать ответ видимым только для пользователя
      };
      dto.reply(replyOptions);
      discUser.send(JSON.stringify(error));
    }
  }
}
