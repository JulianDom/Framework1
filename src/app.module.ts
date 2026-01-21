import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { QueueModule } from '@infra/queues';
import { NotificationProcessor } from '@infra/queues/processors';
import { ChatModule } from '@presentation/gateways';
import { ProvidersModule } from '@infra/providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    QueueModule,
    ChatModule,
    ProvidersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationProcessor,
    // ThrottlerGuard global - aplica rate limiting a todos los endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
