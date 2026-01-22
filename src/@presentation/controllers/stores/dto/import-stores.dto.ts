import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelStoreRowDto {
  @ApiProperty({ description: 'Store name', example: 'Supermercado Centro' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Locality', example: 'Buenos Aires' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  locality!: string;

  @ApiPropertyOptional({ description: 'Zone', example: 'Centro' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  zone?: string;
}

export class ImportStoresDto {
  @ApiProperty({ type: [ExcelStoreRowDto], description: 'Array of stores from Excel' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExcelStoreRowDto)
  stores!: ExcelStoreRowDto[];
}

export class ImportStoresErrorDto {
  @ApiProperty({ description: 'Row number in Excel' })
  row!: number;

  @ApiProperty({ description: 'Name of the problematic store' })
  name!: string;

  @ApiProperty({ description: 'Error message' })
  error!: string;
}

export class ImportStoresResponseDto {
  @ApiProperty({ description: 'Number of stores created' })
  created!: number;

  @ApiProperty({ description: 'Number of stores skipped (duplicates)' })
  skipped!: number;

  @ApiProperty({ type: [ImportStoresErrorDto], description: 'Errors by row' })
  errors!: ImportStoresErrorDto[];
}
