import { IProductRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException, ConflictException } from '@shared/exceptions';

export interface UpdateProductInput {
  productId: string;
  name?: string;
  description?: string;
  brand?: string;
  presentation?: string;
  price?: number;
}

export interface UpdateProductOutput {
  id: string;
  name: string;
  presentation: string;
  price: number;
  active: boolean;
}

/**
 * UpdateProductUseCase
 *
 * Actualiza los datos de un producto.
 * Verifica duplicados si se cambia nombre o presentacion.
 */
export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: UpdateProductInput): Promise<UpdateProductOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new EntityNotFoundException('Product', input.productId);
    }

    // Verificar duplicado si se cambia nombre o presentacion
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
    if (input.brand !== undefined) updateData['brand'] = input.brand;
    if (input.presentation !== undefined) updateData['presentation'] = input.presentation;
    if (input.price !== undefined) updateData['price'] = input.price;

    const updated = await this.productRepository.update(product.id!, updateData);

    return {
      id: updated.id!,
      name: updated.name,
      presentation: updated.presentation,
      price: updated.price,
      active: updated.active,
    };
  }
}
