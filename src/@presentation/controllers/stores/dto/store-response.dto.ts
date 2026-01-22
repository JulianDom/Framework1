import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({ description: 'Store ID' })
  id!: string;

  @ApiProperty({ description: 'Store name' })
  name!: string;

  @ApiProperty({ description: 'Locality' })
  locality!: string;

  @ApiPropertyOptional({ description: 'Zone' })
  zone?: string | null;

  @ApiProperty({ description: 'Active status' })
  active!: boolean;
}

export class StoreDetailResponseDto extends StoreResponseDto {
  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class StoreListItemDto {
  @ApiProperty({ description: 'Store ID' })
  id!: string;

  @ApiProperty({ description: 'Store name' })
  name!: string;

  @ApiProperty({ description: 'Locality' })
  locality!: string;

  @ApiPropertyOptional({ description: 'Zone' })
  zone?: string | null;

  @ApiProperty({ description: 'Active status' })
  active!: boolean;
}

export class StoreListResponseDto {
  @ApiProperty({ type: [StoreListItemDto], description: 'List of stores' })
  data!: StoreListItemDto[];

  @ApiProperty({ description: 'Total number of stores' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;
}
