import { IStoreRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException, ConflictException } from '@shared/exceptions';

export interface UpdateStoreInput {
  storeId: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateStoreOutput {
  id: string;
  name: string;
  code: string;
  address: string;
  active: boolean;
}

/**
 * UpdateStoreUseCase
 *
 * Actualiza los datos de un local.
 * Verifica duplicados si se cambia nombre o dirección.
 */
export class UpdateStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: UpdateStoreInput): Promise<UpdateStoreOutput> {
    const store = await this.storeRepository.findById(input.storeId);

    if (!store) {
      throw new EntityNotFoundException('Store', input.storeId);
    }

    // Verificar duplicado si se cambia nombre o dirección
    const newName = input.name ?? store.name;
    const newAddress = input.address ?? store.address;

    if (input.name !== undefined || input.address !== undefined) {
      const existsDuplicate = await this.storeRepository.existsDuplicate(
        newName,
        newAddress,
        store.id,
      );
      if (existsDuplicate) {
        throw new ConflictException(
          `A store with name "${newName}" and address "${newAddress}" already exists`,
        );
      }
    }

    // Actualizar campos
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData['name'] = input.name;
    if (input.address !== undefined) updateData['address'] = input.address;
    if (input.city !== undefined) updateData['city'] = input.city;
    if (input.state !== undefined) updateData['state'] = input.state;
    if (input.zipCode !== undefined) updateData['zipCode'] = input.zipCode;
    if (input.country !== undefined) updateData['country'] = input.country;
    if (input.latitude !== undefined) updateData['latitude'] = input.latitude;
    if (input.longitude !== undefined) updateData['longitude'] = input.longitude;
    if (input.phone !== undefined) updateData['phone'] = input.phone;
    if (input.email !== undefined) updateData['email'] = input.email;
    if (input.metadata !== undefined) updateData['metadata'] = input.metadata;

    const updated = await this.storeRepository.update(store.id!, updateData);

    return {
      id: updated.id!,
      name: updated.name,
      code: updated.code,
      address: updated.address,
      active: updated.active,
    };
  }
}
