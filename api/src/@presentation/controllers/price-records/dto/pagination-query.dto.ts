import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryWithDatesDto } from '@presentation/dto';

/**
 * PriceRecordPaginationQueryDto
 *
 * DTO para filtrar y paginar registros de precios.
 * Extiende de BaseQueryWithDatesDto que ya incluye:
 * - page, limit (paginación)
 * - sort (ordenamiento)
 * - search (búsqueda global)
 * - dateFrom, dateTo (rango de fechas)
 *
 * Ejemplos de uso:
 *   GET /price-records?page=1&limit=20
 *   GET /price-records?productId=uuid
 *   GET /price-records?storeId=uuid&dateFrom=2024-01-01&dateTo=2024-12-31
 *   GET /price-records?operativeUserId=uuid&sort=-recordedAt
 *   GET /price-records?include=product,store,operativeUser
 */
export class PriceRecordPaginationQueryDto extends BaseQueryWithDatesDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del local/tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del usuario operativo que registró el precio',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  operativeUserId?: string;
}
