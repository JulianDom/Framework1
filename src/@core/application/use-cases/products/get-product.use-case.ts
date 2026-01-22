import { IProductRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface GetProductOutput {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  presentation: string;
  unitPrice: number;
  category: string | null;
  brand: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GetProductUseCase
 *
 * Obtiene los detalles de un producto por ID.
 */
export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(productId: string): Promise<GetProductOutput> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new EntityNotFoundException('Product', productId);
    }

    return {
      id: product.id!,
      name: product.name,
      description: product.description,
      sku: product.sku,
      barcode: product.barcode,
      presentation: product.presentation,
      unitPrice: product.unitPrice,
      category: product.category,
      brand: product.brand,
      imageUrl: product.imageUrl,
      active: product.active,
      createdAt: product.createdAt!,
      updatedAt: product.updatedAt!,
    };
  }
}
