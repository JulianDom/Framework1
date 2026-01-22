import { IPriceRecordRepository } from '@core/application/ports/repositories';
import { PriceRecordWithRelations } from '@core/domain/entities';
import { EntityNotFoundException } from '@shared/exceptions';

/**
 * GetPriceRecordDetailUseCase
 *
 * Obtiene el detalle de un relevamiento de precio específico.
 * Épica 8: Acceso al detalle de relevamientos.
 *
 * Vista solo lectura con información expandida del producto,
 * local y usuario operativo que realizó el relevamiento.
 */
export class GetPriceRecordDetailUseCase {
  constructor(private readonly priceRecordRepository: IPriceRecordRepository) {}

  async execute(priceRecordId: string): Promise<PriceRecordWithRelations> {
    const record = await this.priceRecordRepository.findByIdWithRelations(priceRecordId);

    if (!record) {
      throw new EntityNotFoundException('PriceRecord', priceRecordId);
    }

    return record;
  }
}
