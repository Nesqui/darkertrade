import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from '@discord-nestjs/core';
import { ClientEvents } from 'discord.js';

@Command({
  name: 'play',
  description: 'Plays a song',
})
export class PlayCommand {
  @Handler()
  onPlayCommand(
    @InteractionEvent(SlashCommandPipe) dto: any,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): string {
    console.log('DTO', dto);
    console.log('Event args', args);

    return `Start playing `;
  }
}
