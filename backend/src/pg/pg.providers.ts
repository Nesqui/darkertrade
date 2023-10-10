import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { AttributePair } from 'src/attribute/attribute-pair.entity';
import { Attribute } from 'src/attribute/attribute.entity';
import { Bid } from 'src/bid/bid.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Stat } from 'src/stat/stat.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { Community } from 'src/community/community.entity';
import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/messages/messages.entity';
import { CommunityUser } from 'src/community/community-user.entity';
// import { BaseStat } from 'src/base-stat/base-stat.entity';
import { Offer } from 'src/offer/offer.entity';
import { OfferPair } from 'src/offer/offer-pair.entity';

const initData = async (sequelize: Sequelize, configService: ConfigService) => {
  await sequelize.model('User').findOrCreate({
    where: {
      nickname: 'nesqui',
    },
    defaults: {
      nickname: 'nesqui',
      password: configService.get('SERVICE_ADMIN_PASSWORD_HASH'),
      discord: 'Nesqui#3933',
      active: true,
    },
  });

  await sequelize.model('User').findOrCreate({
    where: {
      nickname: 'xloctis',
    },
    defaults: {
      nickname: 'xloctis',
      password: configService.get('SERVICE_ADMIN_PASSWORD_HASH'),
      discord: 'Xloctis Broodtwine#8421',
      active: true,
    },
  });
};

export const pgProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (ConfigService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: ConfigService.get('PG_DIALECT'),
        logging: false,
        host: ConfigService.get('PG_HOST'),
        port: ConfigService.get('PG_PORT'),
        username: ConfigService.get('PG_USERNAME'),
        password: ConfigService.get('PG_PASSWORD'),
        database: ConfigService.get('PG_DATABASE'),
        operatorsAliases: ConfigService.get('PG_OPERATORSALIASES'),
      });
      sequelize.addModels([
        User,
        Item,
        Attribute,
        ExistingItem,
        Stat,
        AttributePair,
        Bid,
        Community,
        Chat,
        Message,
        CommunityUser,
        // BaseStat,
        Offer,
        OfferPair,
      ]);
      try {
        // await sequelize.sync({ alter: false });
        await sequelize.sync({ alter: true });
        await initData(sequelize, ConfigService);
      } catch (error) {
        console.error(error);
      } finally {
        return sequelize;
      }
    },
  },
];
