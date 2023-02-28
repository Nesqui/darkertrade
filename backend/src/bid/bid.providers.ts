import { Bid } from './bid.entity';

export const bidProviders = [
  {
    provide: 'BID_REPOSITORY',
    useValue: Bid,
  },
];
