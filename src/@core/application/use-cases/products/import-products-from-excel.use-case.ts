import { IProductRepository } from '@core/application/ports/repositories';
import { ProductEntity } from '@core/domain/entities';

export interface ExcelProductRow {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  presentation: string;
  unitPrice: number;
  category?: string;
  brand?: string;
}

export interface ImportProductsInput {
  products: ExcelProductRow[];
}

export interface ImportProductsResult {
  created: number;
  skipped: number;
  errors: Array<{ row: number; sku: string; error: string }>;
}

/**
 * ImportProductsFromExcelUseCase
 *
 * Importa productos desde un array (típicamente parseado de Excel).
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
          sku: 'N/A',
          error: 'Empty row',
        });
        continue;
      }

      try {
        // Validar datos mínimos
        if (!row.name || !row.sku || !row.presentation || row.unitPrice === undefined) {
          result.errors.push({
            row: rowNumber,
            sku: row.sku || 'N/A',
            error: 'Missing required fields (name, sku, presentation, unitPrice)',
          });
          continue;
        }

        // Verificar SKU duplicado
        const existsBySku = await this.productRepository.existsBySku(row.sku);
        if (existsBySku) {
          result.skipped++;
          continue;
        }

        // Verificar duplicado por nombre + presentación
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
          sku: row.sku,
          barcode: row.barcode ?? null,
          presentation: row.presentation,
          unitPrice: row.unitPrice,
          category: row.category ?? null,
          brand: row.brand ?? null,
          imageUrl: null,
          active: true,
        });

        // Persistir
        await this.productRepository.create(product);
        result.created++;
      } catch (error) {
        result.errors.push({
          row: rowNumber,
          sku: row.sku || 'N/A',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }
}
