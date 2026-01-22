import { IStoreRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface ToggleStoreStatusInput {
  storeId: string;
  activate: boolean;
}

export interface ToggleStoreStatusOutput {
  id: string;
  name: string;
  locality: string;
  zone: string | null;
  active: boolean;
}

/**
 * ToggleStoreStatusUseCase
 *
 * Activa o desactiva un local.
 */
export class ToggleStoreStatusUseCase {
  constructor(private readonly storeRepository: IStoreRepository) { }

  async execute(input: ToggleStoreStatusInput): Promise<ToggleStoreStatusOutput> {
    const store = await this.storeRepository.findById(input.storeId);

    if (!store) {
      throw new EntityNotFoundException('Store', input.storeId);
    }

    let updated;
    if (input.activate) {
      updated = await this.storeRepository.activate(input.storeId);
    } else {
      updated = await this.storeRepository.deactivate(input.storeId);
    }

    return {
      id: updated.id!,
      name: updated.name,
      locality: updated.locality,
      zone: updated.zone,
      active: updated.active,
    };
  }
}
