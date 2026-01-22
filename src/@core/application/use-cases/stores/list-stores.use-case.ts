import { IStoreRepository } from '@core/application/ports/repositories';

export interface ListStoresInput {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  activeOnly?: boolean;
}

export interface StoreListItem {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string | null;
  state: string | null;
  active: boolean;
}

export interface ListStoresOutput {
  data: StoreListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ListStoresUseCase
 *
 * Lista todos los locales con paginación y filtros opcionales.
 */
export class ListStoresUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: ListStoresInput): Promise<ListStoresOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    let result: { data: any[]; total: number };

    if (input.search) {
      // Búsqueda por texto
      result = await this.storeRepository.search(input.search, page, limit);
    } else if (input.city) {
      // Filtrar por ciudad
      const stores = await this.storeRepository.findByCity(input.city);
      const start = (page - 1) * limit;
      const paginatedStores = stores.slice(start, start + limit);
      result = { data: paginatedStores, total: stores.length };
    } else {
      // Con o sin filtro activeOnly
      result = await this.storeRepository.findAll(page, limit, input.activeOnly);
    }

    return {
      data: result.data.map((store) => ({
        id: store.id!,
        name: store.name,
        code: store.code,
        address: store.address,
        city: store.city,
        state: store.state,
        active: store.active,
      })),
      total: result.total,
      page,
      limit,
    };
  }
}
