import { IStoreRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface GetStoreOutput {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  active: boolean;
  metadata: Record<string, unknown> | null;
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
      code: store.code,
      address: store.address,
      city: store.city,
      state: store.state,
      zipCode: store.zipCode,
      country: store.country,
      latitude: store.latitude,
      longitude: store.longitude,
      phone: store.phone,
      email: store.email,
      active: store.active,
      metadata: store.metadata,
      createdAt: store.createdAt!,
      updatedAt: store.updatedAt!,
    };
  }
}
