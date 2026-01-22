import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryWithStatusDto } from '@presentation/dto';

/**
 * StorePaginationQueryDto
 *
 * DTO para filtrar y paginar locales/tiendas.
 * Extiende de BaseQueryWithStatusDto que ya incluye:
 * - page, limit (paginación)
 * - sort (ordenamiento)
 * - search (búsqueda global)
 * - activeOnly (filtro de estado)
 *
 * Ejemplos de uso:
 *   GET /stores?page=1&limit=20
 *   GET /stores?search=sucursal centro
 *   GET /stores?city=Buenos Aires&activeOnly=true
 *   GET /stores?sort=name&state=CABA
 */
export class StorePaginationQueryDto extends BaseQueryWithStatusDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ciudad',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado/provincia',
    example: 'CABA',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por país',
    example: 'Argentina',
  })
  @IsOptional()
  @IsString()
  country?: string;
}
