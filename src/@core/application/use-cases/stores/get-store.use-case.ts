import { IStoreRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface GetStoreOutput {
  id: string;
  name: string;
  locality: string;
  zone: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GetStoreUseCase
 *
 * Obtiene los detalles de un local por ID.
 */
export class GetStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(storeId: string): Promise<GetStoreOutput> {
    const store = await this.storeRepository.findById(storeId);

    if (!store) {
      throw new EntityNotFoundException('Store', storeId);
    }

    return {
      id: store.id!,
      name: store.name,
      locality: store.locality,
      zone: store.zone,
      active: store.active,
      createdAt: store.createdAt!,
      updatedAt: store.updatedAt!,
    };
  }
}
