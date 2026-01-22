import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryWithStatusDto } from '@presentation/dto';

/**
 * ProductPaginationQueryDto
 *
 * DTO para filtrar y paginar productos.
 * Extiende de BaseQueryWithStatusDto que ya incluye:
 * - page, limit (paginación)
 * - sort (ordenamiento: "-createdAt,name")
 * - search (búsqueda global)
 * - activeOnly (filtro de estado)
 *
 * Ejemplos de uso desde el frontend:
 *
 * Paginación básica:
 *   GET /products?page=1&limit=20
 *
 * Ordenamiento:
 *   GET /products?sort=-createdAt          → más recientes primero
 *   GET /products?sort=name                → alfabético A-Z
 *   GET /products?sort=-unitPrice,name     → precio desc, luego nombre asc
 *
 * Búsqueda global (busca en name, sku, barcode, description):
 *   GET /products?search=coca cola
 *
 * Filtros específicos:
 *   GET /products?category=bebidas
 *   GET /products?brand=Coca-Cola
 *   GET /products?activeOnly=true
 *
 * Rango de precios:
 *   GET /products?minPrice=100&maxPrice=500
 *
 * Combinando todo:
 *   GET /products?search=cola&category=bebidas&maxPrice=200&sort=-unitPrice&page=1&limit=10&activeOnly=true
 */
export class ProductPaginationQueryDto extends BaseQueryWithStatusDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoría exacta',
    example: 'bebidas',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por marca exacta',
    example: 'Coca-Cola',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por presentación',
    example: '500ml',
  })
  @IsOptional()
  @IsString()
  presentation?: string;

  @ApiPropertyOptional({
    description: 'Precio mínimo (unitPrice >= valor)',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Precio máximo (unitPrice <= valor)',
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
