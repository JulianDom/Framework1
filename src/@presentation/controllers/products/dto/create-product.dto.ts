import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, MinLength, MaxLength, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Aceite de Girasol' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Aceite de girasol refinado' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Brand', example: 'Natura' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiProperty({ description: 'Product presentation (e.g., 1L, 500g, unit)', example: '1L' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  presentation!: string;

  @ApiProperty({ description: 'Price', example: 1500.50 })
  @IsNumber()
  @Min(0)
  price!: number;
}
