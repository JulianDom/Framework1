import { IProductRepository } from '@core/application/ports/repositories';
import { ProductEntity } from '@core/domain/entities';
import { ConflictException } from '@shared/exceptions';

export interface CreateProductInput {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  presentation: string;
  unitPrice: number;
  category?: string;
  brand?: string;
  imageUrl?: string;
}

export interface CreateProductOutput {
  id: string;
  name: string;
  sku: string;
  presentation: string;
  unitPrice: number;
  active: boolean;
}

/**
 * CreateProductUseCase
 *
 * Crea un nuevo producto.
 * Previene duplicados según nombre + presentación y SKU único.
 */
export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // Verificar SKU único
    const existsBySku = await this.productRepository.existsBySku(input.sku);
    if (existsBySku) {
      throw new ConflictException(`A product with SKU "${input.sku}" already exists`);
    }

    // Verificar duplicado por nombre + presentación
    const existsDuplicate = await this.productRepository.existsDuplicate(
      input.name,
      input.presentation,
    );
    if (existsDuplicate) {
      throw new ConflictException(
        `A product with name "${input.name}" and presentation "${input.presentation}" already exists`,
      );
    }

    // Crear entidad
    const product = ProductEntity.create({
      name: input.name,
      description: input.description ?? null,
      sku: input.sku,
      barcode: input.barcode ?? null,
      presentation: input.presentation,
      unitPrice: input.unitPrice,
      category: input.category ?? null,
      brand: input.brand ?? null,
      imageUrl: input.imageUrl ?? null,
      active: true,
    });

    // Persistir
    const created = await this.productRepository.create(product);

    return {
      id: created.id!,
      name: created.name,
      sku: created.sku,
      presentation: created.presentation,
      unitPrice: created.unitPrice,
      active: created.active,
    };
  }
}
