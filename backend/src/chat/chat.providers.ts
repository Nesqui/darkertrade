import { Chat } from './chat.entity';

export const chatsProvider = [
  {
    provide: 'CHATS_REPOSITORY',
    useValue: Chat,
  },
];
