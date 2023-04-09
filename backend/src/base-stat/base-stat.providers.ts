import { BaseStat } from './base-stat.entity';

export const baseStatProviders = [
  {
    provide: 'BASE_STAT_REPOSITORY',
    useValue: BaseStat,
  },
];
