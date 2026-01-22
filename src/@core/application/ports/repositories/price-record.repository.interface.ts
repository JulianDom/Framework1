import { PriceRecordEntity, PriceRecordWithRelations } from '@core/domain/entities';

/**
 * Filtros para búsqueda de relevamientos de precios
 */
export interface PriceRecordFilters {
  productId?: string;
  storeId?: string;
  operativeUserId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * IPriceRecordRepository - Puerto de Repositorio
 *
 * Define el contrato para la persistencia de relevamientos de precios.
 * Épica 8: Visualización/Consumo de Precios
 */
export interface IPriceRecordRepository {
  // CRUD básico
  findById(id: string): Promise<PriceRecordEntity | null>;
  findAll(page?: number, limit?: number): Promise<{ data: PriceRecordEntity[]; total: number }>;
  create(entity: PriceRecordEntity): Promise<PriceRecordEntity>;
  update(id: string, data: Record<string, unknown>): Promise<PriceRecordEntity>;
  softDelete(id: string): Promise<PriceRecordEntity>;

  // Métodos específicos para Épica 8
  findWithFilters(
    filters: PriceRecordFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: PriceRecordEntity[]; total: number }>;

  // Obtener con relaciones expandidas (para visualización)
  findByIdWithRelations(id: string): Promise<PriceRecordWithRelations | null>;
  findAllWithRelations(
    filters: PriceRecordFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: PriceRecordWithRelations[]; total: number }>;

  // Consultas específicas
  findByProduct(productId: string): Promise<PriceRecordEntity[]>;
  findByStore(storeId: string): Promise<PriceRecordEntity[]>;
  findByOperativeUser(operativeUserId: string): Promise<PriceRecordEntity[]>;
  findByDateRange(dateFrom: Date, dateTo: Date): Promise<PriceRecordEntity[]>;

  // Estadísticas
  getAveragePriceByProduct(productId: string): Promise<number | null>;
  getLatestPriceByProductAndStore(productId: string, storeId: string): Promise<number | null>;
}

export const PRICE_RECORD_REPOSITORY = Symbol('IPriceRecordRepository');
