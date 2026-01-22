import { IProductRepository } from '@core/application/ports/repositories';
import { ProductEntity } from '@core/domain/entities';
import { ConflictException } from '@shared/exceptions';

export interface CreateProductInput {
  name: string;
  description?: string;
  brand?: string;
  presentation: string;
  price: number;
}

export interface CreateProductOutput {
  id: string;
  name: string;
  presentation: string;
  price: number;
  active: boolean;
}

/**
 * CreateProductUseCase
 *
 * Crea un nuevo producto.
 * Previene duplicados segun nombre + presentacion.
 */
export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    // Verificar duplicado por nombre + presentacion
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
      brand: input.brand ?? null,
      presentation: input.presentation,
      price: input.price,
      active: true,
    });

    // Persistir
    const created = await this.productRepository.create(product);

    return {
      id: created.id!,
      name: created.name,
      presentation: created.presentation,
      price: created.price,
      active: created.active,
    };
  }
}
