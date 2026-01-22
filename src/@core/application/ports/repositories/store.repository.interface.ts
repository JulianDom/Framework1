import { StoreEntity } from '@core/domain/entities';

/**
 * IStoreRepository - Puerto de Repositorio de Local
 *
 * Define el contrato que debe cumplir cualquier implementación
 * de persistencia de locales.
 */
export interface IStoreRepository {
  findById(id: string): Promise<StoreEntity | null>;
  findByCode(code: string): Promise<StoreEntity | null>;
  findAll(page?: number, limit?: number, activeOnly?: boolean): Promise<{ data: StoreEntity[]; total: number }>;
  findActive(): Promise<StoreEntity[]>;
  findByCity(city: string): Promise<StoreEntity[]>;
  create(entity: StoreEntity): Promise<StoreEntity>;
  createMany(entities: StoreEntity[]): Promise<StoreEntity[]>;
  update(id: string, entity: Partial<StoreEntity>): Promise<StoreEntity>;
  activate(id: string): Promise<StoreEntity>;
  deactivate(id: string): Promise<StoreEntity>;
  /**
   * Verifica si existe un local con el código dado
   */
  existsByCode(code: string): Promise<boolean>;
  /**
   * Verifica si existe un local duplicado (mismo nombre + dirección)
   */
  existsDuplicate(name: string, address: string, excludeId?: string): Promise<boolean>;
  /**
   * Búsqueda de locales por nombre o dirección
   */
  search(query: string, page?: number, limit?: number): Promise<{ data: StoreEntity[]; total: number }>;
}

export const STORE_REPOSITORY = Symbol('IStoreRepository');
