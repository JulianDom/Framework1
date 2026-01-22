import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, MaxLength, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelStoreRowDto {
  @ApiProperty({ description: 'Store name', example: 'Supermercado Centro' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Unique code', example: 'SUP-CEN-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ description: 'Address', example: 'Av. San Martín 1234' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Zip code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;
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

  @ApiProperty({ description: 'Code of the problematic store' })
  code!: string;

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
