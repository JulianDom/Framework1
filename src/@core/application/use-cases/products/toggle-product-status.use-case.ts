import { IProductRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface ToggleProductStatusInput {
  productId: string;
  activate: boolean;
}

export interface ToggleProductStatusOutput {
  id: string;
  name: string;
  sku: string;
  presentation: string;
  unitPrice: number;
  active: boolean;
}

/**
 * ToggleProductStatusUseCase
 *
 * Activa o desactiva un producto.
 */
export class ToggleProductStatusUseCase {
  constructor(private readonly productRepository: IProductRepository) { }

  async execute(input: ToggleProductStatusInput): Promise<ToggleProductStatusOutput> {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new EntityNotFoundException('Product', input.productId);
    }

    let updated;
    if (input.activate) {
      updated = await this.productRepository.activate(input.productId);
    } else {
      updated = await this.productRepository.deactivate(input.productId);
    }

    return {
      id: updated.id!,
      name: updated.name,
      sku: updated.sku,
      presentation: updated.presentation,
      unitPrice: Number(updated.unitPrice),
      active: updated.active,
    };
  }
}
