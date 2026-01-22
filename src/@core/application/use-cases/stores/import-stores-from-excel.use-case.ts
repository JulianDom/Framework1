import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity } from '@core/domain/entities';

export interface ExcelStoreRow {
  name: string;
  locality: string;
  zone?: string;
}

export interface ImportStoresInput {
  stores: ExcelStoreRow[];
}

export interface ImportStoresResult {
  created: number;
  skipped: number;
  errors: Array<{ row: number; name: string; error: string }>;
}

/**
 * ImportStoresFromExcelUseCase
 *
 * Importa locales desde un array (tipicamente parseado de Excel).
 * Salta duplicados y reporta errores por fila.
 * Todos los locales importados estan activos por defecto.
 */
export class ImportStoresFromExcelUseCase {
  constructor(private readonly storeRepository: IStoreRepository) {}

  async execute(input: ImportStoresInput): Promise<ImportStoresResult> {
    const result: ImportStoresResult = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < input.stores.length; i++) {
      const row = input.stores[i];
      const rowNumber = i + 2; // +2 porque Excel tiene header en fila 1

      // Validar que row existe
      if (!row) {
        result.errors.push({
          row: rowNumber,
          name: 'N/A',
          error: 'Empty row',
        });
        continue;
      }

      try {
        // Validar datos minimos
        if (!row.name || !row.locality) {
          result.errors.push({
            row: rowNumber,
            name: row.name || 'N/A',
            error: 'Missing required fields (name, locality)',
          });
          continue;
        }

        // Verificar duplicado por nombre + localidad
        const existsDuplicate = await this.storeRepository.existsDuplicate(row.name, row.locality);
        if (existsDuplicate) {
          result.skipped++;
          continue;
        }

        // Crear entidad - activo por defecto
        const store = StoreEntity.create({
          name: row.name,
          locality: row.locality,
          zone: row.zone ?? null,
          active: true,
        });

        // Persistir
        await this.storeRepository.create(store);
        result.created++;
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          name: row.name || 'N/A',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }
}
