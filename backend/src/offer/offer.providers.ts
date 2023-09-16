import { Offer } from './offer.entity';

export const offerProviders = [
  {
    provide: 'OFFERS_REPOSITORY',
    useValue: Offer,
  },
];
