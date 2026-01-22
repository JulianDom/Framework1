import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional, Min } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Brand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Presentation', example: '1L' })
  @IsString()
  @IsNotEmpty()
  presentation!: string;

  @ApiProperty({ description: 'Price', example: 1500.50 })
  @IsNumber()
  @Min(0)
  price!: number;
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

  @ApiProperty({ description: 'Name of the problematic product' })
  name!: string;

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
