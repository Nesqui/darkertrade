import { Stat } from './stat.entity';

export const statsProviders = [
  {
    provide: 'STATS_REPOSITORY',
    useValue: Stat,
  },
];
