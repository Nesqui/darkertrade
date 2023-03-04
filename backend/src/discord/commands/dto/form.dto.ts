import { Field, TextInputValue } from '@discord-nestjs/core';
import { TextInputModalData } from 'discord.js';

export class FormDto {
  @Field('username')
  @TextInputValue()
  username: TextInputModalData;

  @Field('comment')
  @TextInputValue()
  comment: TextInputModalData;

  // @TextInputValue() // Custom id is optional. By default, will be used property name.
  // comment: string;
}
