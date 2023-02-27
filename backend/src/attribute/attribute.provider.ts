import { Attribute } from './attribute.entity';

export const attributesProviders = [
  {
    provide: 'ATTRIBUTES_REPOSITORY',
    useValue: Attribute,
  },
];
