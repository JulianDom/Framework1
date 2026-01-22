import { IProductRepository } from '@core/application/ports/repositories';

export interface ListProductsInput {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  activeOnly?: boolean;
}

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  presentation: string;
  unitPrice: number;
  category: string | null;
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
 * Lista productos con paginación y filtros opcionales.
 */
export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: ListProductsInput): Promise<ListProductsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    let result: { data: any[]; total: number };

    if (input.search) {
      // Búsqueda por texto
      result = await this.productRepository.search(input.search, page, limit);
    } else if (input.category) {
      // Filtrar por categoría
      const products = await this.productRepository.findByCategory(input.category);
      const start = (page - 1) * limit;
      const paginatedProducts = products.slice(start, start + limit);
      result = { data: paginatedProducts, total: products.length };
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
        sku: product.sku,
        presentation: product.presentation,
        unitPrice: product.unitPrice,
        category: product.category,
        brand: product.brand,
        active: product.active,
      })),
      total: result.total,
      page,
      limit,
    };
  }
}
