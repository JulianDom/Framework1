import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: 'Store name', example: 'Supermercado Centro Renovado' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'Locality' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  locality?: string;

  @ApiPropertyOptional({ description: 'Zone' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  zone?: string;
}
