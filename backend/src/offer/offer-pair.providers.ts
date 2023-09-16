import { OfferPair } from './offer-pair.entity';

export const offerPairProviders = [
  {
    provide: 'OFFER_PAIRS_REPOSITORY',
    useValue: OfferPair,
  },
];
