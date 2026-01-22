import { IProductRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException, ConflictException } from '@shared/exceptions';

export interface UpdateProductInput {
  productId: string;
  name?: string;
  description?: string;
  barcode?: string;
  presentation?: string;
  unitPrice?: number;
  category?: string;
  brand?: string;
  imageUrl?: string;
}

export interface UpdateProductOutput {
  id: string;
  name: string;
  sku: string;
  presentation: string;
  unitPrice: number;
  active: boolean;
}

/**
 * UpdateProductUseCase
 *
 * Actualiza los datos de un producto.
 * Verifica duplicados si se cambia nombre o presentación.
 */
export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new EntityNotFoundException('Product', input.productId);
    }

    // Verificar duplicado si se cambia nombre o presentación
    const newName = input.name ?? product.name;
    const newPresentation = input.presentation ?? product.presentation;

    if (input.name !== undefined || input.presentation !== undefined) {
      const existsDuplicate = await this.productRepository.existsDuplicate(
        newName,
        newPresentation,
        product.id,
      );
      if (existsDuplicate) {
        throw new ConflictException(
          `A product with name "${newName}" and presentation "${newPresentation}" already exists`,
        );
      }
    }

    // Actualizar campos
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.description !== undefined) updateData['description'] = input.description;
    if (input.barcode !== undefined) updateData['barcode'] = input.barcode;
    if (input.presentation !== undefined) updateData['presentation'] = input.presentation;
    if (input.unitPrice !== undefined) updateData['unitPrice'] = input.unitPrice;
    if (input.category !== undefined) updateData['category'] = input.category;
    if (input.brand !== undefined) updateData['brand'] = input.brand;
    if (input.imageUrl !== undefined) updateData['imageUrl'] = input.imageUrl;

    const updated = await this.productRepository.update(product.id!, updateData);

    return {
      id: updated.id!,
      name: updated.name,
      sku: updated.sku,
      presentation: updated.presentation,
      unitPrice: updated.unitPrice,
      active: updated.active,
    };
  }
}
