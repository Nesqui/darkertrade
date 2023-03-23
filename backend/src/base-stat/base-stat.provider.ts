import { BaseStat } from './base-stat.entity';

export const baseStatProvider = [
  {
    provide: 'BASE_STAT_REPOSITORY',
    useValue: BaseStat,
  },
];
