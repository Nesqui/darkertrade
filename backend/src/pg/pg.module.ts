import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { pgProviders } from './pg.providers';

@Module({
  providers: [...pgProviders],
  exports: [...pgProviders],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class PgModule {}
