import { AdministratorEntity } from '@core/domain/entities';

/**
 * IAdministratorRepository - Puerto de Repositorio de Administrador
 *
 * Define el contrato que debe cumplir cualquier implementación
 * de persistencia de administradores.
 */
export interface IAdministratorRepository {
  findById(id: string): Promise<AdministratorEntity | null>;
  findByEmail(email: string): Promise<AdministratorEntity | null>;
  findByUsername(username: string): Promise<AdministratorEntity | null>;
  findAll(page?: number, limit?: number, enabledOnly?: boolean): Promise<{ data: AdministratorEntity[]; total: number }>;
  findEnabled(): Promise<AdministratorEntity[]>;
  create(entity: AdministratorEntity): Promise<AdministratorEntity>;
  update(id: string, entity: Partial<AdministratorEntity>): Promise<AdministratorEntity>;
  delete(id: string): Promise<void>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
  updateRecoverPasswordID(id: string, id_: string | null): Promise<void>;
  /**
   * Crea un administrador con su refresh token en una sola transacción.
   * Garantiza atomicidad: si falla el guardado del token, no se crea el admin.
   */
  createWithRefreshToken(entity: AdministratorEntity, hashedToken: string): Promise<AdministratorEntity>;
}

export const ADMINISTRATOR_REPOSITORY = Symbol('IAdministratorRepository');
