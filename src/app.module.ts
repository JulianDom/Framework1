import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { AuthPresentationModule } from '@presentation/controllers/auth/auth.module';
import { AdministratorsPresentationModule } from '@presentation/controllers/administrators/administrators.module';
import { OperativeUsersPresentationModule } from '@presentation/controllers/operative-users/operative-users.module';
import { ProductsPresentationModule } from '@presentation/controllers/products/products.module';
import { StoresPresentationModule } from '@presentation/controllers/stores/stores.module';
import { PriceRecordsPresentationModule } from '@presentation/controllers/price-records/price-records.module';
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
    // Presentation Modules
    AuthPresentationModule,
    AdministratorsPresentationModule, // Épica 4
    OperativeUsersPresentationModule, // Épica 5
    ProductsPresentationModule,       // Épica 6
    StoresPresentationModule,         // Épica 7
    PriceRecordsPresentationModule,   // Épica 8
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
