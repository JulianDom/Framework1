import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { StoresController } from './stores.controller';
import {
  CreateStoreUseCase,
  UpdateStoreUseCase,
  ListStoresUseCase,
  GetStoreUseCase,
  ToggleStoreStatusUseCase,
  ImportStoresFromExcelUseCase,
} from '@core/application/use-cases/stores';
import {
  STORE_REPOSITORY,
  IStoreRepository,
} from '@core/application/ports/repositories';
import { StoreRepository } from '@infra/database/repositories';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { RolesGuard } from '@presentation/guards';
import { getJwtModuleConfig } from '@shared/config';

/**
 * StoresPresentationModule
 *
 * Épica 7: Gestión de Locales (Administrador)
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
  controllers: [StoresController],
  providers: [
    RolesGuard,

    // Repository
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepository,
    },

    // Use Cases
    {
      provide: CreateStoreUseCase,
      useFactory: (storeRepo: IStoreRepository) => new CreateStoreUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
    {
      provide: UpdateStoreUseCase,
      useFactory: (storeRepo: IStoreRepository) => new UpdateStoreUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
    {
      provide: ListStoresUseCase,
      useFactory: (storeRepo: IStoreRepository) => new ListStoresUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
    {
      provide: GetStoreUseCase,
      useFactory: (storeRepo: IStoreRepository) => new GetStoreUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
    {
      provide: ToggleStoreStatusUseCase,
      useFactory: (storeRepo: IStoreRepository) => new ToggleStoreStatusUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
    {
      provide: ImportStoresFromExcelUseCase,
      useFactory: (storeRepo: IStoreRepository) => new ImportStoresFromExcelUseCase(storeRepo),
      inject: [STORE_REPOSITORY],
    },
  ],
})
export class StoresPresentationModule {}
