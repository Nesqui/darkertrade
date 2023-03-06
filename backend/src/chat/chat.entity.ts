import {
  Table,
  Column,
  Model,
  HasMany,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { Community } from 'src/community/community.entity';
import { Message } from 'src/messages/messages.entity';

@Table
export class Chat extends Model {
  @Column
  name: string;

  @HasMany(() => Message)
  messages: Message[];
  
  @ForeignKey(() => Community)
  @AllowNull(false)
  @Column
  communityId: number;

  @BelongsTo(() => Community)
  community: Community;
}
