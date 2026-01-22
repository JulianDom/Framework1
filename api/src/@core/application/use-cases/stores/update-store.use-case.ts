import { IStoreRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException, ConflictException } from '@shared/exceptions';

export interface UpdateStoreInput {
  storeId: string;
  name?: string;
  locality?: string;
  zone?: string;
}

export interface UpdateStoreOutput {
  id: string;
  name: string;
  locality: string;
  zone: string | null;
  active: boolean;
}

/**
 * UpdateStoreUseCase
 *
 * Actualiza los datos de un local.
 * Verifica duplicados si se cambia nombre o localidad.
 */
export class UpdateStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: UpdateStoreInput): Promise<UpdateStoreOutput> {
    const store = await this.storeRepository.findById(input.storeId);

    if (!store) {
      throw new EntityNotFoundException('Store', input.storeId);
    }

    // Verificar duplicado si se cambia nombre o localidad
    const newName = input.name ?? store.name;
    const newLocality = input.locality ?? store.locality;

    if (input.name !== undefined || input.locality !== undefined) {
      const existsDuplicate = await this.storeRepository.existsDuplicate(
        newName,
        newLocality,
        store.id,
      );
      if (existsDuplicate) {
        throw new ConflictException(
          `A store with name "${newName}" and locality "${newLocality}" already exists`,
        );
      }
    }

    // Actualizar campos
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.locality !== undefined) updateData['locality'] = input.locality;
    if (input.zone !== undefined) updateData['zone'] = input.zone;

    const updated = await this.storeRepository.update(store.id!, updateData);

    return {
      id: updated.id!,
      name: updated.name,
      locality: updated.locality,
      zone: updated.zone,
      active: updated.active,
    };
  }
}
