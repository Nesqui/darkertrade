import { Message } from './messages.entity';

export const messagesProviders = [
  {
    provide: 'MESSAGES_REPOSITORY',
    useValue: Message,
  },
];
