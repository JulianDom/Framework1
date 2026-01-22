import { IProductRepository } from '@core/application/ports/repositories';
import { ProductEntity } from '@core/domain/entities';

export interface ExcelProductRow {
  name: string;
  description?: string;
  brand?: string;
  presentation: string;
  price: number;
}

export interface ImportProductsInput {
  products: ExcelProductRow[];
}

export interface ImportProductsResult {
  created: number;
  skipped: number;
  errors: Array<{ row: number; name: string; error: string }>;
}

/**
 * ImportProductsFromExcelUseCase
 *
 * Importa productos desde un array (tipicamente parseado de Excel).
 * Salta duplicados y reporta errores por fila.
 */
export class ImportProductsFromExcelUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: ImportProductsInput): Promise<ImportProductsResult> {
    const result: ImportProductsResult = {
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < input.products.length; i++) {
      const row = input.products[i];
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
        if (!row.name || !row.presentation || row.price === undefined) {
          result.errors.push({
            row: rowNumber,
            name: row.name || 'N/A',
            error: 'Missing required fields (name, presentation, price)',
          });
          continue;
        }

        // Verificar duplicado por nombre + presentacion
        const existsDuplicate = await this.productRepository.existsDuplicate(
          row.name,
          row.presentation,
        );
        if (existsDuplicate) {
          result.skipped++;
          continue;
        }

        // Crear entidad
        const product = ProductEntity.create({
          name: row.name,
          description: row.description ?? null,
          brand: row.brand ?? null,
          presentation: row.presentation,
          price: row.price,
          active: true,
        });

        // Persistir
        await this.productRepository.create(product);
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
