import { IPriceRecordRepository, PriceRecordFilters } from '@core/application/ports/repositories';
import { PriceRecordWithRelations } from '@core/domain/entities';

export interface ListPriceRecordsInput {
  page?: number;
  limit?: number;
  productId?: string;
  storeId?: string;
  operativeUserId?: string;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
}

export interface ListPriceRecordsOutput {
  data: PriceRecordWithRelations[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ListPriceRecordsUseCase
 *
 * Lista relevamientos de precios con filtros.
 * Épica 8: Visualización global de precios cargados.
 *
 * Filtros básicos soportados:
 * - fecha (dateFrom, dateTo)
 * - local (storeId)
 * - producto (productId)
 * - usuario (operativeUserId)
 *
 * Vista solo lectura.
 */
export class ListPriceRecordsUseCase {
  constructor(private readonly priceRecordRepository: IPriceRecordRepository) {}

  async execute(input: ListPriceRecordsInput): Promise<ListPriceRecordsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    // Construir filtros
    const filters: PriceRecordFilters = {};

    if (input.productId) {
      filters.productId = input.productId;
    }

    if (input.storeId) {
      filters.storeId = input.storeId;
    }

    if (input.operativeUserId) {
      filters.operativeUserId = input.operativeUserId;
    }

    if (input.dateFrom) {
      filters.dateFrom = new Date(input.dateFrom);
    }

    if (input.dateTo) {
      filters.dateTo = new Date(input.dateTo);
    }

    // Obtener datos con relaciones expandidas
    const result = await this.priceRecordRepository.findAllWithRelations(filters, page, limit);

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
    };
  }
}
