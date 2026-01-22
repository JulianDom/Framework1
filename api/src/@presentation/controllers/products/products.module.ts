import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsController } from './products.controller';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
  ListProductsUseCase,
  GetProductUseCase,
  ToggleProductStatusUseCase,
  ImportProductsFromExcelUseCase,
} from '@core/application/use-cases/products';
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
} from '@core/application/ports/repositories';
import { ProductRepository } from '@infra/database/repositories';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { RolesGuard } from '@presentation/guards';
import { getJwtModuleConfig } from '@shared/config';

/**
 * ProductsPresentationModule
 *
 * Épica 6: Gestión de Productos (Administrador)
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
  controllers: [ProductsController],
  providers: [
    RolesGuard,

    // Repository
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },

    // Use Cases
    {
      provide: CreateProductUseCase,
      useFactory: (productRepo: IProductRepository) => new CreateProductUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (productRepo: IProductRepository) => new UpdateProductUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (productRepo: IProductRepository) => new ListProductsUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: GetProductUseCase,
      useFactory: (productRepo: IProductRepository) => new GetProductUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ToggleProductStatusUseCase,
      useFactory: (productRepo: IProductRepository) => new ToggleProductStatusUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ImportProductsFromExcelUseCase,
      useFactory: (productRepo: IProductRepository) =>
        new ImportProductsFromExcelUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
  ],
})
export class ProductsPresentationModule {}
