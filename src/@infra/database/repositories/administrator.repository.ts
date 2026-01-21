import { Injectable } from '@nestjs/common';
import { Administrator } from '@prisma/client';
import { PrismaService } from '@infra/database/prisma';
import { IAdministratorRepository } from '@core/application/ports/repositories';
import { AdministratorEntity, AdminModules } from '@core/domain/entities';
import { PrismaRepository } from './base.repository';

/**
 * AdministratorRepository - Implementación Prisma
 *
 * Extiende PrismaRepository para heredar operaciones CRUD base.
 * Solo implementa métodos específicos del dominio de administradores.
 */
@Injectable()
export class AdministratorRepository
  extends PrismaRepository<Administrator, AdministratorEntity>
  implements IAdministratorRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'administrator');
  }

  // ==================== Mappers ====================

  protected toEntity(model: Administrator): AdministratorEntity {
    return AdministratorEntity.reconstitute({
      id: model.id,
      fullName: model.fullName,
      emailAddress: model.emailAddress,
      username: model.username,
      password: model.password,
      enabled: model.enabled,
      refreshToken: model.refreshToken,
      recoverPasswordID: model.recoverPasswordID,
      modules: model.modules as AdminModules | null,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  protected toPersistence(entity: AdministratorEntity): Record<string, unknown> {
    const data = entity.toObject();
    return {
      fullName: data.fullName,
      emailAddress: data.emailAddress,
      username: data.username,
      password: data.password,
      enabled: data.enabled ?? true,
      modules: data.modules,
    };
  }

  // ==================== Domain-Specific Methods ====================

  async findByEmail(email: string): Promise<AdministratorEntity | null> {
    return this.findOne({ emailAddress: email });
  }

  async findByUsername(username: string): Promise<AdministratorEntity | null> {
    return this.findOne({ username });
  }

  // @ts-expect-error - Override with different signature to match IAdministratorRepository
  override async findAll(page = 1, limit = 10): Promise<{ data: AdministratorEntity[]; total: number }> {
    const result = await super.findPaginated({ page, limit });
    return {
      data: result.data,
      total: result.meta.totalItems,
    };
  }

  async findEnabled(): Promise<AdministratorEntity[]> {
    return this.findMany({ enabled: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        enabled: false,
        refreshToken: null,
      },
    });
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await this.model.update({
      where: { id },
      data: { refreshToken: token },
    });
  }

  async updateRecoverPasswordID(id: string, recoverId: string | null): Promise<void> {
    await this.model.update({
      where: { id },
      data: { recoverPasswordID: recoverId },
    });
  }

  async createWithRefreshToken(
    entity: AdministratorEntity,
    hashedToken: string,
  ): Promise<AdministratorEntity> {
    const data = this.toPersistence(entity);

    const created = await this.prisma.$transaction(async (tx) => {
      return tx.administrator.create({
        data: {
          ...data,
          refreshToken: hashedToken,
        } as any,
      });
    });

    return this.toEntity(created);
  }
}
