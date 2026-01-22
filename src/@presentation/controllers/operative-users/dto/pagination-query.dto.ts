import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BaseQueryWithStatusDto } from '@presentation/dto';

/**
 * OperativeUserPaginationQueryDto
 *
 * DTO para filtrar y paginar usuarios operativos.
 * Extiende de BaseQueryWithStatusDto que ya incluye:
 * - page, limit (paginación)
 * - sort (ordenamiento)
 * - search (búsqueda global)
 * - activeOnly (filtro de estado)
 *
 * Ejemplos de uso:
 *   GET /operative-users?page=1&limit=20
 *   GET /operative-users?search=juan
 *   GET /operative-users?createdById=uuid&activeOnly=true
 *   GET /operative-users?sort=-createdAt
 */
export class OperativeUserPaginationQueryDto extends BaseQueryWithStatusDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID del administrador que lo creó',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}
