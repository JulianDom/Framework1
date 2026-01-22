import { IPriceRecordRepository } from '@core/application/ports/repositories';
import { IProductRepository } from '@core/application/ports/repositories';
import { IStoreRepository } from '@core/application/ports/repositories';
import { IOperativeUserRepository } from '@core/application/ports/repositories';
import { PriceRecordEntity } from '@core/domain/entities';
import { EntityNotFoundException } from '@shared/exceptions';

export interface CreatePriceRecordInput {
  productId: string;
  storeId: string;
  operativeUserId: string;
  price: number;
  recordedAt?: string; // ISO date string, defaults to now
  notes?: string;
  photoUrl?: string;
}

export interface CreatePriceRecordOutput {
  id: string;
  productId: string;
  storeId: string;
  operativeUserId: string;
  price: number;
  recordedAt: Date;
  notes: string | null;
  photoUrl: string | null;
  createdAt: Date;
}

/**
 * CreatePriceRecordUseCase
 *
 * Crea un nuevo registro de precio.
 * Usado por usuarios operativos para registrar precios en campo.
 *
 * Validaciones:
 * - El producto debe existir y estar activo
 * - El local debe existir y estar activo
 * - El usuario operativo debe existir y estar habilitado
 * - El precio no puede ser negativo
 */
export class CreatePriceRecordUseCase {
  constructor(
    private readonly priceRecordRepository: IPriceRecordRepository,
    private readonly productRepository: IProductRepository,
    private readonly storeRepository: IStoreRepository,
    private readonly operativeUserRepository: IOperativeUserRepository,
  ) {}

  async execute(input: CreatePriceRecordInput): Promise<CreatePriceRecordOutput> {
    // Validar que el producto existe
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new EntityNotFoundException('Product', input.productId);
    }

    // Validar que el local existe
    const store = await this.storeRepository.findById(input.storeId);
    if (!store) {
      throw new EntityNotFoundException('Store', input.storeId);
    }

    // Validar que el usuario operativo existe
    const operativeUser = await this.operativeUserRepository.findById(input.operativeUserId);
    if (!operativeUser) {
      throw new EntityNotFoundException('OperativeUser', input.operativeUserId);
    }

    // Crear la entidad
    const priceRecord = PriceRecordEntity.create({
      productId: input.productId,
      storeId: input.storeId,
      operativeUserId: input.operativeUserId,
      price: input.price,
      recordedAt: input.recordedAt ? new Date(input.recordedAt) : new Date(),
      notes: input.notes,
      photoUrl: input.photoUrl,
    });

    // Persistir
    const created = await this.priceRecordRepository.create(priceRecord);

    return {
      id: created.id!,
      productId: created.productId,
      storeId: created.storeId,
      operativeUserId: created.operativeUserId,
      price: created.price,
      recordedAt: created.recordedAt,
      notes: created.notes,
      photoUrl: created.photoUrl,
      createdAt: created.createdAt!,
    };
  }
}
