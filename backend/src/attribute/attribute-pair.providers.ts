import { AttributePair } from './attribute-pair.entity';


export const attributesPairsProviders = [
  {
    provide: 'ATTRIBUTES_PAIRS_REPOSITORY',
    useValue: AttributePair,
  },
];

