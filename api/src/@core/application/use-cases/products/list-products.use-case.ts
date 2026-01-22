import { IProductRepository } from '@core/application/ports/repositories';

export interface ListProductsInput {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  activeOnly?: boolean;
}

export interface ProductListItem {
  id: string;
  name: string;
  presentation: string;
  price: number;
  brand: string | null;
  active: boolean;
}

export interface ListProductsOutput {
  data: ProductListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ListProductsUseCase
 *
 * Lista productos con paginacion y filtros opcionales.
 */
export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: ListProductsInput): Promise<ListProductsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    let result: { data: any[]; total: number };

    if (input.search) {
      // Busqueda por texto
      result = await this.productRepository.search(input.search, page, limit);
    } else if (input.brand) {
      // Filtrar por marca
      const products = await this.productRepository.findByBrand(input.brand);
      const start = (page - 1) * limit;
      const paginatedProducts = products.slice(start, start + limit);
      result = { data: paginatedProducts, total: products.length };
    } else {
      // Con o sin filtro activeOnly
      result = await this.productRepository.findAll(page, limit, input.activeOnly);
    }

    return {
      data: result.data.map((product) => ({
        id: product.id!,
        name: product.name,
        presentation: product.presentation,
        price: product.price,
        brand: product.brand,
        active: product.active,
      })),
      total: result.total,
      page,
      limit,
    };
  }
}
