import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity } from '@core/domain/entities';
import { ConflictException } from '@shared/exceptions';

export interface CreateStoreInput {
  name: string;
  locality: string;
  zone?: string;
}

export interface CreateStoreOutput {
  id: string;
  name: string;
  locality: string;
  zone: string | null;
  active: boolean;
}

/**
 * CreateStoreUseCase
 *
 * Crea un nuevo local.
 * Previene duplicados segun nombre + localidad.
 * Todos los locales estan activos por defecto.
 */
export class CreateStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: CreateStoreInput): Promise<CreateStoreOutput> {
    // Verificar duplicado por nombre + localidad
    const existsDuplicate = await this.storeRepository.existsDuplicate(input.name, input.locality);
    if (existsDuplicate) {
      throw new ConflictException(
        `A store with name "${input.name}" and locality "${input.locality}" already exists`,
      );
    }

    // Crear entidad - activo por defecto
    const store = StoreEntity.create({
      name: input.name,
      locality: input.locality,
      zone: input.zone ?? null,
      active: true,
    });

    // Persistir
    const created = await this.storeRepository.create(store);

    return {
      id: created.id!,
      name: created.name,
      locality: created.locality,
      zone: created.zone,
      active: created.active,
    };
  }
}
