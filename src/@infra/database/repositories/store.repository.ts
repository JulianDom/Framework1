import { Injectable } from '@nestjs/common';
import { Store, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma';
import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity, StoreMetadata } from '@core/domain/entities';
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
      code: model.code,
      address: model.address,
      city: model.city,
      state: model.state,
      zipCode: model.zipCode,
      country: model.country,
      latitude: model.latitude?.toNumber() ?? null,
      longitude: model.longitude?.toNumber() ?? null,
      phone: model.phone,
      email: model.email,
      active: model.active,
      metadata: model.metadata as StoreMetadata | null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  protected toPersistence(entity: StoreEntity): Record<string, unknown> {
    const data = entity.toObject();
    return {
      name: data.name,
      code: data.code,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country ?? 'Argentina',
      latitude: data.latitude != null ? new Prisma.Decimal(data.latitude) : null,
      longitude: data.longitude != null ? new Prisma.Decimal(data.longitude) : null,
      phone: data.phone,
      email: data.email,
      active: data.active ?? true,
      metadata: data.metadata,
    };
  }

  // ==================== Domain-Specific Methods ====================

  async findByCode(code: string): Promise<StoreEntity | null> {
    return this.findOne({ code });
  }

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

  async findByCity(city: string): Promise<StoreEntity[]> {
    return this.findMany({ city });
  }

  async createMany(entities: StoreEntity[]): Promise<StoreEntity[]> {
    const data = entities.map((e) => this.toPersistence(e));

    await this.model.createMany({
      data,
      skipDuplicates: true,
    });

    // Recuperar los locales creados por código
    const codes = entities.map((e) => e.code);
    const created = await this.model.findMany({
      where: {
        code: { in: codes },
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

  async existsByCode(code: string): Promise<boolean> {
    return this.exists({ code });
  }

  async existsDuplicate(name: string, address: string, excludeId?: string): Promise<boolean> {
    const where: Record<string, unknown> = {
      name: { equals: name, mode: 'insensitive' },
      address: { equals: address, mode: 'insensitive' },
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
        { address: { contains: query, mode: 'insensitive' as const } },
        { code: { contains: query, mode: 'insensitive' as const } },
        { city: { contains: query, mode: 'insensitive' as const } },
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
