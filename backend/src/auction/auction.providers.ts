import { Auction } from './auction.entity';

export const auctionProviders = [
  {
    provide: 'AUCTION_REPOSITORY',
    useValue: Auction,
  },
];
