import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, MinLength, MaxLength, IsOptional } from 'class-validator';

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

  @ApiProperty({ description: 'Unique SKU code', example: 'ACE-GIR-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiPropertyOptional({ description: 'Barcode (EAN/UPC)', example: '7790001234567' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiProperty({ description: 'Product presentation (e.g., 1L, 500g, unit)', example: '1L' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  presentation!: string;

  @ApiProperty({ description: 'Unit price', example: 1500.50 })
  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Category', example: 'Aceites' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Brand', example: 'Natura' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ description: 'Product image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
