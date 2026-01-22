import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma';
import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity } from '@core/domain/entities';
import { PrismaRepository } from './base.repository';

/**
 * StoreRepository - Implementación Prisma
 *
 * Extiende PrismaRepository para heredar operaciones CRUD base.
 * Implementa métodos específicos para gestión de locales.
 */
@Injectable()
export class StoreRepository
  extends PrismaRepository<Store, StoreEntity>
  implements IStoreRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'store');
  }

  // ==================== Mappers ====================

  protected toEntity(model: Store): StoreEntity {
    return StoreEntity.reconstitute({
      id: model.id,
      name: model.name,
      locality: model.locality,
      zone: model.zone,
      active: model.active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  protected toPersistence(entity: StoreEntity): Record<string, unknown> {
    const data = entity.toObject();
    return {
      name: data.name,
      locality: data.locality,
      zone: data.zone,
      active: data.active ?? true,
    };
  }

  // ==================== Domain-Specific Methods ====================

  // @ts-expect-error - Override with different signature to match IStoreRepository
  override async findAll(
    page = 1,
    limit = 10,
    activeOnly = false,
  ): Promise<{ data: StoreEntity[]; total: number }> {
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
      data: data.map((d: Store) => this.toEntity(d)),
      total,
    };
  }

  async findActive(): Promise<StoreEntity[]> {
    return this.findMany({ active: true });
  }

  async findByLocality(locality: string): Promise<StoreEntity[]> {
    return this.findMany({ locality });
  }

  async findByZone(zone: string): Promise<StoreEntity[]> {
    return this.findMany({ zone });
  }

  async createMany(entities: StoreEntity[]): Promise<StoreEntity[]> {
    const data = entities.map((e) => this.toPersistence(e));

    await this.model.createMany({
      data,
      skipDuplicates: true,
    });

    // Recuperar los locales creados por nombre + localidad
    const names = entities.map((e) => e.name);
    const created = await this.model.findMany({
      where: {
        name: { in: names },
        deletedAt: null,
      },
    });

    return created.map((s: Store) => this.toEntity(s));
  }

  async activate(id: string): Promise<StoreEntity> {
    const updated = await this.model.update({
      where: { id },
      data: { active: true },
    });
    return this.toEntity(updated);
  }

  async deactivate(id: string): Promise<StoreEntity> {
    const updated = await this.model.update({
      where: { id },
      data: { active: false },
    });
    return this.toEntity(updated);
  }

  async existsDuplicate(name: string, locality: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, unknown> = {
      name: { equals: name, mode: 'insensitive' },
      locality: { equals: locality, mode: 'insensitive' },
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
  ): Promise<{ data: StoreEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { locality: { contains: query, mode: 'insensitive' as const } },
        { zone: { contains: query, mode: 'insensitive' as const } },
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
      data: data.map((s: Store) => this.toEntity(s)),
      total,
    };
  }
}
