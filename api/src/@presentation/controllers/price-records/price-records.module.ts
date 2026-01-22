import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PriceRecordsController } from './price-records.controller';
import {
  ListPriceRecordsUseCase,
  GetPriceRecordDetailUseCase,
  CreatePriceRecordUseCase,
} from '@core/application/use-cases/price-records';
import {
  PRICE_RECORD_REPOSITORY,
  IPriceRecordRepository,
  PRODUCT_REPOSITORY,
  IProductRepository,
  STORE_REPOSITORY,
  IStoreRepository,
  OPERATIVE_USER_REPOSITORY,
  IOperativeUserRepository,
} from '@core/application/ports/repositories';
import {
  PriceRecordRepository,
  ProductRepository,
  StoreRepository,
  OperativeUserRepository,
} from '@infra/database/repositories';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { RolesGuard } from '@presentation/guards';
import { getJwtModuleConfig } from '@shared/config';

/**
 * PriceRecordsPresentationModule
 *
 * Épica 8: Visualización/Consumo de Precios
 * - Creación de registros de precios (Operativos)
 * - Visualización global de precios (Administradores)
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtModuleConfig(configService),
    }),
  ],
  controllers: [PriceRecordsController],
  providers: [
    RolesGuard,

    // Repositories
    {
      provide: PRICE_RECORD_REPOSITORY,
      useClass: PriceRecordRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepository,
    },
    {
      provide: OPERATIVE_USER_REPOSITORY,
      useClass: OperativeUserRepository,
    },

    // Use Cases
    {
      provide: ListPriceRecordsUseCase,
      useFactory: (priceRecordRepo: IPriceRecordRepository) =>
        new ListPriceRecordsUseCase(priceRecordRepo),
      inject: [PRICE_RECORD_REPOSITORY],
    },
    {
      provide: GetPriceRecordDetailUseCase,
      useFactory: (priceRecordRepo: IPriceRecordRepository) =>
        new GetPriceRecordDetailUseCase(priceRecordRepo),
      inject: [PRICE_RECORD_REPOSITORY],
    },
    {
      provide: CreatePriceRecordUseCase,
      useFactory: (
        priceRecordRepo: IPriceRecordRepository,
        productRepo: IProductRepository,
        storeRepo: IStoreRepository,
        operativeUserRepo: IOperativeUserRepository,
      ) => new CreatePriceRecordUseCase(priceRecordRepo, productRepo, storeRepo, operativeUserRepo),
      inject: [
        PRICE_RECORD_REPOSITORY,
        PRODUCT_REPOSITORY,
        STORE_REPOSITORY,
        OPERATIVE_USER_REPOSITORY,
      ],
    },
  ],
})
export class PriceRecordsPresentationModule {}
