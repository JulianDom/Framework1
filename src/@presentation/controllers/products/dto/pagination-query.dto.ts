import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryWithStatusDto } from '@presentation/dto';

/**
 * ProductPaginationQueryDto
 *
 * DTO para filtrar y paginar productos.
 * Extiende de BaseQueryWithStatusDto que ya incluye:
 * - page, limit (paginacion)
 * - sort (ordenamiento: "-createdAt,name")
 * - search (busqueda global)
 * - activeOnly (filtro de estado)
 *
 * Ejemplos de uso desde el frontend:
 *
 * Paginacion basica:
 *   GET /products?page=1&limit=20
 *
 * Ordenamiento:
 *   GET /products?sort=-createdAt          -> mas recientes primero
 *   GET /products?sort=name                -> alfabetico A-Z
 *   GET /products?sort=-price,name         -> precio desc, luego nombre asc
 *
 * Busqueda global (busca en name, brand, description, presentation):
 *   GET /products?search=coca cola
 *
 * Filtros especificos:
 *   GET /products?brand=Coca-Cola
 *   GET /products?activeOnly=true
 *
 * Rango de precios:
 *   GET /products?minPrice=100&maxPrice=500
 *
 * Combinando todo:
 *   GET /products?search=cola&brand=Coca-Cola&maxPrice=200&sort=-price&page=1&limit=10&activeOnly=true
 */
export class ProductPaginationQueryDto extends BaseQueryWithStatusDto {
  @ApiPropertyOptional({
    description: 'Filtrar por marca exacta',
    example: 'Coca-Cola',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por presentacion',
    example: '500ml',
  })
  @IsOptional()
  @IsString()
  presentation?: string;

  @ApiPropertyOptional({
    description: 'Precio minimo (price >= valor)',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Precio maximo (price <= valor)',
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
}
