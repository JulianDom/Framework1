import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma';
import { IProductRepository } from '@core/application/ports/repositories';
import { ProductEntity } from '@core/domain/entities';
import { PrismaRepository } from './base.repository';

/**
 * ProductRepository - Implementación Prisma
 *
 * Extiende PrismaRepository para heredar operaciones CRUD base.
 * Implementa métodos específicos para gestión de productos.
 */
@Injectable()
export class ProductRepository
  extends PrismaRepository<Product, ProductEntity>
  implements IProductRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  // ==================== Mappers ====================

  protected toEntity(model: Product): ProductEntity {
    return ProductEntity.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description,
      brand: model.brand,
      presentation: model.presentation,
      price: model.price.toNumber(),
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  protected toPersistence(entity: ProductEntity): Record<string, unknown> {
    const data = entity.toObject();
    return {
      name: data.name,
      description: data.description,
      brand: data.brand,
      presentation: data.presentation,
      price: new Prisma.Decimal(data.price),
      active: data.active ?? true,
    };
  }

  // ==================== Domain-Specific Methods ====================

  // @ts-expect-error - Override with different signature to match IProductRepository
  override async findAll(
    page = 1,
    limit = 10,
    activeOnly = false,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const whereCondition: Record<string, unknown> = { deletedAt: null };

    if (activeOnly) {
      whereCondition['active'] = true;
    }

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.model.count({ where: whereCondition }),
    ]);

    return {
      data: data.map((d: Product) => this.toEntity(d)),
      total,
    };
  }

  async findActive(): Promise<ProductEntity[]> {
    return this.findMany({ active: true });
  }

  async findByBrand(brand: string): Promise<ProductEntity[]> {
    return this.findMany({ brand });
  }

  async createMany(entities: ProductEntity[]): Promise<ProductEntity[]> {
    const data = entities.map((e) => this.toPersistence(e));

    await this.model.createMany({
      data,
      skipDuplicates: true,
    });

    // Recuperar los productos creados por nombre + presentacion
    const names = entities.map((e) => e.name);
    const created = await this.model.findMany({
      where: {
        name: { in: names },
        deletedAt: null,
      },
    });

    return created.map((p: Product) => this.toEntity(p));
  }

  async activate(id: string): Promise<ProductEntity> {
    const updated = await this.model.update({
      where: { id },
      data: { active: true },
    });
    return this.toEntity(updated);
  }

  async deactivate(id: string): Promise<ProductEntity> {
    const updated = await this.model.update({
      where: { id },
      data: { active: false },
    });
    return this.toEntity(updated);
  }

  async existsDuplicate(name: string, presentation: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, unknown> = {
      name: { equals: name, mode: 'insensitive' },
      presentation: { equals: presentation, mode: 'insensitive' },
      deletedAt: null,
    };

    if (excludeId) {
      where['id'] = { not: excludeId };
    }

    const count = await this.model.count({ where });
    return count > 0;
  }

  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { brand: { contains: query, mode: 'insensitive' as const } },
        { presentation: { contains: query, mode: 'insensitive' as const } },
      ],
      deletedAt: null,
    };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.model.count({ where }),
    ]);

    return {
      data: data.map((p: Product) => this.toEntity(p)),
      total,
    };
  }
}
