import { Injectable } from '@nestjs/common';
import { PriceRecord, Prisma } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma';
import {
  IPriceRecordRepository,
  PriceRecordFilters,
} from '@core/application/ports/repositories';
import { PriceRecordEntity, PriceRecordWithRelations } from '@core/domain/entities';
import { PrismaRepository } from './base.repository';

/**
 * PriceRecordRepository - Implementación Prisma
 *
 * Extiende PrismaRepository para heredar operaciones CRUD base.
 * Implementa métodos específicos para visualización de precios (Épica 8).
 */
@Injectable()
export class PriceRecordRepository
  extends PrismaRepository<PriceRecord, PriceRecordEntity>
  implements IPriceRecordRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'priceRecord');
  }

  // ==================== Mappers ====================

  protected toEntity(model: PriceRecord): PriceRecordEntity {
    return PriceRecordEntity.reconstitute({
      id: model.id,
      productId: model.productId,
      storeId: model.storeId,
      operativeUserId: model.operativeUserId,
      price: model.price.toNumber(),
      recordedAt: model.recordedAt,
      notes: model.notes,
      photoUrl: model.photoUrl,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  protected toPersistence(entity: PriceRecordEntity): Record<string, unknown> {
    const data = entity.toObject();
    return {
      productId: data.productId,
      storeId: data.storeId,
      operativeUserId: data.operativeUserId,
      price: new Prisma.Decimal(data.price),
      recordedAt: data.recordedAt,
      notes: data.notes,
      photoUrl: data.photoUrl,
    };
  }

  // ==================== Override findAll ====================

  // @ts-expect-error - Override with different signature
  override async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: PriceRecordEntity[]; total: number }> {
    const result = await super.findPaginated({ page, limit });
    return {
      data: result.data,
      total: result.meta.totalItems,
    };
  }

  // ==================== Métodos específicos Épica 8 ====================

  async findWithFilters(
    filters: PriceRecordFilters,
    page = 1,
    limit = 10,
  ): Promise<{ data: PriceRecordEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { recordedAt: 'desc' },
      }),
      this.model.count({ where }),
    ]);

    return {
      data: data.map((r: PriceRecord) => this.toEntity(r)),
      total,
    };
  }

  async findByIdWithRelations(id: string): Promise<PriceRecordWithRelations | null> {
    const record = await this.model.findFirst({
      where: { id, deletedAt: null },
      include: {
        product: true,
        store: true,
        operativeUser: true,
      },
    });

    if (!record) return null;

    return this.mapToRelations(record);
  }

  async findAllWithRelations(
    filters: PriceRecordFilters,
    page = 1,
    limit = 10,
  ): Promise<{ data: PriceRecordWithRelations[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { recordedAt: 'desc' },
        include: {
          product: true,
          store: true,
          operativeUser: true,
        },
      }),
      this.model.count({ where }),
    ]);

    return {
      data: data.map((r: any) => this.mapToRelations(r)),
      total,
    };
  }

  async findByProduct(productId: string): Promise<PriceRecordEntity[]> {
    return this.findMany({ productId });
  }

  async findByStore(storeId: string): Promise<PriceRecordEntity[]> {
    return this.findMany({ storeId });
  }

  async findByOperativeUser(operativeUserId: string): Promise<PriceRecordEntity[]> {
    return this.findMany({ operativeUserId });
  }

  async findByDateRange(dateFrom: Date, dateTo: Date): Promise<PriceRecordEntity[]> {
    const records = await this.model.findMany({
      where: {
        recordedAt: {
          gte: dateFrom,
          lte: dateTo,
        },
        deletedAt: null,
      },
      orderBy: { recordedAt: 'desc' },
    });

    return records.map((r: PriceRecord) => this.toEntity(r));
  }

  async getAveragePriceByProduct(productId: string): Promise<number | null> {
    const result = await this.model.aggregate({
      where: { productId, deletedAt: null },
      _avg: { price: true },
    });

    return result._avg.price?.toNumber() ?? null;
  }

  async getLatestPriceByProductAndStore(
    productId: string,
    storeId: string,
  ): Promise<number | null> {
    const record = await this.model.findFirst({
      where: { productId, storeId, deletedAt: null },
      orderBy: { recordedAt: 'desc' },
    });

    return record?.price.toNumber() ?? null;
  }

  // ==================== Helpers ====================

  private buildWhereClause(filters: PriceRecordFilters): Record<string, unknown> {
    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.productId) {
      where['productId'] = filters.productId;
    }

    if (filters.storeId) {
      where['storeId'] = filters.storeId;
    }

    if (filters.operativeUserId) {
      where['operativeUserId'] = filters.operativeUserId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where['recordedAt'] = {};
      if (filters.dateFrom) {
        (where['recordedAt'] as Record<string, unknown>)['gte'] = filters.dateFrom;
      }
      if (filters.dateTo) {
        (where['recordedAt'] as Record<string, unknown>)['lte'] = filters.dateTo;
      }
    }

    return where;
  }

  private mapToRelations(record: any): PriceRecordWithRelations {
    return {
      id: record.id,
      price: record.price.toNumber(),
      recordedAt: record.recordedAt,
      notes: record.notes,
      photoUrl: record.photoUrl,
      product: {
        id: record.product.id,
        name: record.product.name,
        sku: record.product.sku,
        presentation: record.product.presentation,
      },
      store: {
        id: record.store.id,
        name: record.store.name,
        code: record.store.code,
        address: record.store.address,
      },
      operativeUser: {
        id: record.operativeUser.id,
        fullName: record.operativeUser.fullName,
        username: record.operativeUser.username,
      },
    };
  }
}
