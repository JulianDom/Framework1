import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsArray, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelProductRowDto {
  @ApiProperty({ description: 'Product name', example: 'Aceite de Girasol' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Unique SKU', example: 'ACE-GIR-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiPropertyOptional({ description: 'Barcode' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ description: 'Presentation', example: '1L' })
  @IsString()
  @IsNotEmpty()
  presentation!: string;

  @ApiProperty({ description: 'Unit price', example: 1500.50 })
  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Brand' })
  @IsOptional()
  @IsString()
  brand?: string;
}

export class ImportProductsDto {
  @ApiProperty({ type: [ExcelProductRowDto], description: 'Array of products from Excel' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExcelProductRowDto)
  products!: ExcelProductRowDto[];
}

export class ImportProductsErrorDto {
  @ApiProperty({ description: 'Row number in Excel' })
  row!: number;

  @ApiProperty({ description: 'SKU of the problematic product' })
  sku!: string;

  @ApiProperty({ description: 'Error message' })
  error!: string;
}

export class ImportProductsResponseDto {
  @ApiProperty({ description: 'Number of products created' })
  created!: number;

  @ApiProperty({ description: 'Number of products skipped (duplicates)' })
  skipped!: number;

  @ApiProperty({ type: [ImportProductsErrorDto], description: 'Errors by row' })
  errors!: ImportProductsErrorDto[];
}
