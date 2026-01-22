import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryWithStatusDto } from '@presentation/dto';

/**
 * StorePaginationQueryDto
 *
 * DTO para filtrar y paginar locales/tiendas.
 * Extiende de BaseQueryWithStatusDto que ya incluye:
 * - page, limit (paginacion)
 * - sort (ordenamiento)
 * - search (busqueda global)
 * - activeOnly (filtro de estado)
 *
 * Ejemplos de uso:
 *   GET /stores?page=1&limit=20
 *   GET /stores?search=sucursal centro
 *   GET /stores?locality=Buenos Aires&activeOnly=true
 *   GET /stores?sort=name&zone=Centro
 */
export class StorePaginationQueryDto extends BaseQueryWithStatusDto {
  @ApiPropertyOptional({
    description: 'Filtrar por localidad',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  locality?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por zona',
    example: 'Centro',
  })
  @IsOptional()
  @IsString()
  zone?: string;
}
