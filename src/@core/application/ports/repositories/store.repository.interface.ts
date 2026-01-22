import { StoreEntity } from '@core/domain/entities';

/**
 * IStoreRepository - Puerto de Repositorio de Local
 *
 * Define el contrato que debe cumplir cualquier implementación
 * de persistencia de locales.
 *
 * Campos del modelo Store:
 * - name, locality, zone, active
 */
export interface IStoreRepository {
  findById(id: string): Promise<StoreEntity | null>;
  findAll(page?: number, limit?: number, activeOnly?: boolean): Promise<{ data: StoreEntity[]; total: number }>;
  findActive(): Promise<StoreEntity[]>;
  findByLocality(locality: string): Promise<StoreEntity[]>;
  findByZone(zone: string): Promise<StoreEntity[]>;
  create(entity: StoreEntity): Promise<StoreEntity>;
  createMany(entities: StoreEntity[]): Promise<StoreEntity[]>;
  update(id: string, entity: Partial<StoreEntity>): Promise<StoreEntity>;
  activate(id: string): Promise<StoreEntity>;
  deactivate(id: string): Promise<StoreEntity>;
  /**
   * Verifica si existe un local duplicado (mismo nombre + localidad)
   */
  existsDuplicate(name: string, locality: string, excludeId?: string): Promise<boolean>;
  /**
   * Busqueda de locales por nombre, localidad o zona
   */
  search(query: string, page?: number, limit?: number): Promise<{ data: StoreEntity[]; total: number }>;
}

export const STORE_REPOSITORY = Symbol('IStoreRepository');
