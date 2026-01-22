import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Store name', example: 'Supermercado Centro' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
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
