import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-ioredis';
import { RedisClientOptions } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [HttpModule,CacheModule.register<RedisClientOptions>({
    store: redisStore,
    port: 6379,
    host: "localhost",
    db: 1,
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
