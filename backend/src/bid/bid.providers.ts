import { Bid } from './bid.entity';

export const bidProviders = [
  {
    provide: 'BIDS_REPOSITORY',
    useValue: Bid,
  },
];
