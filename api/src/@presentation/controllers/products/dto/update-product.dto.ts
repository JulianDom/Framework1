import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, MaxLength, IsOptional, Min } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Brand' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({ description: 'Product presentation', example: '1.5L' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  presentation?: string;

  @ApiPropertyOptional({ description: 'Price', example: 1650.00 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
