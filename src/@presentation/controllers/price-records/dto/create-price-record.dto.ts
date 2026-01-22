import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  IsUrl,
} from 'class-validator';

/**
 * CreatePriceRecordDto
 *
 * DTO para crear un nuevo registro de precio.
 * Usado por usuarios operativos para registrar precios en campo.
 */
export class CreatePriceRecordDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    description: 'ID del local donde se registra el precio',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  storeId!: string;

  @ApiProperty({
    description: 'Precio registrado (unitario)',
    example: 1250.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Fecha del relevamiento (ISO 8601). Si no se envía, usa fecha actual.',
    example: '2026-01-22T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  recordedAt?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el precio',
    example: 'Precio en promoción',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto del precio (evidencia)',
    example: 'https://storage.example.com/photos/price-123.jpg',
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}

/**
 * CreatePriceRecordResponseDto
 *
 * Respuesta simplificada al crear un registro de precio.
 */
export class CreatePriceRecordResponseDto {
  @ApiProperty({ description: 'ID del registro creado' })
  id!: string;

  @ApiProperty({ description: 'ID del producto' })
  productId!: string;

  @ApiProperty({ description: 'ID del local' })
  storeId!: string;

  @ApiProperty({ description: 'ID del usuario operativo' })
  operativeUserId!: string;

  @ApiProperty({ description: 'Precio registrado' })
  price!: number;

  @ApiProperty({ description: 'Fecha del relevamiento' })
  recordedAt!: Date;

  @ApiPropertyOptional({ description: 'Notas' })
  notes?: string | null;

  @ApiPropertyOptional({ description: 'URL de la foto' })
  photoUrl?: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;
}
