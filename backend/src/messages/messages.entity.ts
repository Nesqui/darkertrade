import {
  Table,
  Column,
  Model,
  AllowNull,
  BelongsTo,
  ForeignKey,
  Length,
  Default,
} from 'sequelize-typescript';
import { Chat } from 'src/chat/chat.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { User } from 'src/user/user.entity';

@Table
export class Message extends Model {
  @Length({
    min: 1,
    max: 333,
  })
  @Column
  text: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @Default(false)
  @Column
  read: boolean;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Chat)
  @AllowNull(false)
  @Column
  chatId: number;

  @BelongsTo(() => Chat)
  chat: Chat;

  @ForeignKey(() => ExistingItem)
  @Column
  existingItemId: number;

  @BelongsTo(() => ExistingItem)
  existingItem: ExistingItem;
}
