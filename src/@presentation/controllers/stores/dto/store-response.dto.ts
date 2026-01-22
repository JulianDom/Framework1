import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({ description: 'Store ID' })
  id!: string;

  @ApiProperty({ description: 'Store name' })
  name!: string;

  @ApiProperty({ description: 'Unique code' })
  code!: string;

  @ApiProperty({ description: 'Address' })
  address!: string;

  @ApiProperty({ description: 'Active status' })
  active!: boolean;
}

export class StoreDetailResponseDto extends StoreResponseDto {
  @ApiPropertyOptional({ description: 'City' })
  city?: string | null;

  @ApiPropertyOptional({ description: 'State/Province' })
  state?: string | null;

  @ApiPropertyOptional({ description: 'Zip code' })
  zipCode?: string | null;

  @ApiProperty({ description: 'Country' })
  country!: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  latitude?: number | null;

  @ApiPropertyOptional({ description: 'Longitude' })
  longitude?: number | null;

  @ApiPropertyOptional({ description: 'Phone' })
  phone?: string | null;

  @ApiPropertyOptional({ description: 'Email' })
  email?: string | null;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: Record<string, unknown> | null;

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

  @ApiProperty({ description: 'Unique code' })
  code!: string;

  @ApiProperty({ description: 'Address' })
  address!: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string | null;

  @ApiPropertyOptional({ description: 'State/Province' })
  state?: string | null;

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
