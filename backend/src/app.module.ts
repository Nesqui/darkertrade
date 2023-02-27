import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PgModule } from './pg/pg.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { AttributeModule } from './attribute/attribute.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PgModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ItemModule,
    AttributeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
