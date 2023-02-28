import { ExistingItem } from './existing-item.entity';

export const existingItemProviders = [
  {
    provide: 'EXISTING_ITEM_REPOSITORY',
    useValue: ExistingItem,
  },
];
