import { IStoreRepository } from '@core/application/ports/repositories';
import { StoreEntity } from '@core/domain/entities';

export interface ExcelStoreRow {
  name: string;
  code: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface ImportStoresInput {
  stores: ExcelStoreRow[];
}

export interface ImportStoresResult {
  created: number;
  skipped: number;
  errors: Array<{ row: number; code: string; error: string }>;
}

/**
 * ImportStoresFromExcelUseCase
 *
 * Importa locales desde un array (típicamente parseado de Excel).
 * Salta duplicados y reporta errores por fila.
 * Todos los locales importados están activos por defecto.
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
          code: 'N/A',
          error: 'Empty row',
        });
        continue;
      }

      try {
        // Validar datos mínimos
        if (!row.name || !row.code || !row.address) {
          result.errors.push({
            row: rowNumber,
            code: row.code || 'N/A',
            error: 'Missing required fields (name, code, address)',
          });
          continue;
        }

        // Verificar código duplicado
        const existsByCode = await this.storeRepository.existsByCode(row.code);
        if (existsByCode) {
          result.skipped++;
          continue;
        }

        // Verificar duplicado por nombre + dirección
        const existsDuplicate = await this.storeRepository.existsDuplicate(row.name, row.address);
        if (existsDuplicate) {
          result.skipped++;
          continue;
        }

        // Crear entidad - activo por defecto
        const store = StoreEntity.create({
          name: row.name,
          code: row.code,
          address: row.address,
          city: row.city ?? null,
          state: row.state ?? null,
          zipCode: row.zipCode ?? null,
          country: row.country ?? 'Argentina',
          latitude: null,
          longitude: null,
          phone: row.phone ?? null,
          email: row.email ?? null,
          active: true,
          metadata: null,
        });

        // Persistir
        await this.storeRepository.create(store);
        result.created++;
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          code: row.code || 'N/A',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }
}
