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
import { Client, ClientEvents, PermissionFlagsBits } from 'discord.js';
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
    const discordId = dto.user.id
    const discUser = await this.client.users.fetch(discordId);
    
    try {
      const user = await this.usersRepository.findOne({
        where: {
          discordId,
        },
      });
  
      if (!user) {
        discUser.send('Current user not found, please register first, or ask moderators to help (Xloctis or Nesqui).')
        dto.reply('Please check your dm')
        return  
     }

      const hash = uuidv4();
      user.hash = hash
      await user.save()

      const discordMessage =
      `__${this.configService.get('APP_URL')}/auth?hash=${hash}__` +
      '\n' +
      `Your link to reset user on **TaT**`;

      discUser.send(discordMessage)
      dto.reply('Please check your dm')
    } catch (error) {
      dto.reply('Please check your dm')
      discUser.send(JSON.stringify(error))
    }
  }
}
