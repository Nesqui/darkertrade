import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { AttributePair } from 'src/attribute/attribute-pair.entity';
import { Attribute } from 'src/attribute/attribute.entity';
import { Auction } from 'src/auction/auction.entity';
import { Bid } from 'src/bid/bid.entity';
import { ExistingItem } from 'src/existing-item/existing-item.entity';
import { Stat } from 'src/stat/stat.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';

const initData = async (sequelize: Sequelize, configServise: ConfigService) => {
  await sequelize.model('User').findOrCreate({
    where: {
      nickname: 'Nesqui',
    },
    defaults: {
      nickname: 'Nesqui',
      password: configServise.get('SERVICE_ADMIN_PASSWORD_HASH'),
      discord: 'Nesqui#3933',
      active: true,
    },
  });

  await sequelize.model('User').findOrCreate({
    where: {
      nickname: 'Xloctis',
    },
    defaults: {
      nickname: 'Xloctis',
      password: configServise.get('SERVICE_ADMIN_PASSWORD_HASH'),
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
        AttributePair,
        Attribute,
        Stat,
        ExistingItem,
        Auction,
        Bid,
      ]);
      await sequelize.sync({
        alter: true,
      });

      await initData(sequelize, ConfigService);
      return sequelize;
    },
  },
];
