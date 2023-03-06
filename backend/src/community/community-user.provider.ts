import { CommunityUser } from './community-user.entity';

export const communityUsersProviders = [
  {
    provide: 'COMMUNITY_USERS_REPOSITORY',
    useValue: CommunityUser,
  },
];
