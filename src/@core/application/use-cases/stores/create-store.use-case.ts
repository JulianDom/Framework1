import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity } from '@core/domain/entities';
import { ConflictException } from '@shared/exceptions';

export interface CreateStoreInput {
  name: string;
  code: string;
  address: string;
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

export interface CreateStoreOutput {
  id: string;
  name: string;
  code: string;
  address: string;
  active: boolean;
}

/**
 * CreateStoreUseCase
 *
 * Crea un nuevo local.
 * Previene duplicados según código único y nombre + dirección.
 * Todos los locales están activos por defecto.
 */
export class CreateStoreUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: CreateStoreInput): Promise<CreateStoreOutput> {
    // Verificar código único
    const existsByCode = await this.storeRepository.existsByCode(input.code);
    if (existsByCode) {
      throw new ConflictException(`A store with code "${input.code}" already exists`);
    }

    // Verificar duplicado por nombre + dirección
    const existsDuplicate = await this.storeRepository.existsDuplicate(input.name, input.address);
    if (existsDuplicate) {
      throw new ConflictException(
        `A store with name "${input.name}" and address "${input.address}" already exists`,
      );
    }

    // Crear entidad - activo por defecto
    const store = StoreEntity.create({
      name: input.name,
      code: input.code,
      address: input.address,
      city: input.city ?? null,
      state: input.state ?? null,
      zipCode: input.zipCode ?? null,
      country: input.country ?? 'Argentina',
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      active: true,
      metadata: input.metadata ?? null,
    });

    // Persistir
    const created = await this.storeRepository.create(store);

    return {
      id: created.id!,
      name: created.name,
      code: created.code,
      address: created.address,
      active: created.active,
    };
  }
}
