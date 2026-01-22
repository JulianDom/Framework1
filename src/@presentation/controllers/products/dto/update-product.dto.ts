import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product name', example: 'Aceite de Girasol Premium' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Barcode (EAN/UPC)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiPropertyOptional({ description: 'Product presentation', example: '1.5L' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  presentation?: string;

  @ApiPropertyOptional({ description: 'Unit price', example: 1650.00 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @ApiPropertyOptional({ description: 'Category' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ description: 'Brand' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ description: 'Product image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
