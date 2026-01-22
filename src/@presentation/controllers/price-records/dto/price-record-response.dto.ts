import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriceRecordProductDto {
  @ApiProperty({ description: 'Product ID' })
  id!: string;

  @ApiProperty({ description: 'Product name' })
  name!: string;

  @ApiProperty({ description: 'Product SKU' })
  sku!: string;

  @ApiProperty({ description: 'Product presentation' })
  presentation!: string;
}

export class PriceRecordStoreDto {
  @ApiProperty({ description: 'Store ID' })
  id!: string;

  @ApiProperty({ description: 'Store name' })
  name!: string;

  @ApiProperty({ description: 'Store code' })
  code!: string;

  @ApiProperty({ description: 'Store address' })
  address!: string;
}

export class PriceRecordOperativeUserDto {
  @ApiProperty({ description: 'Operative user ID' })
  id!: string;

  @ApiProperty({ description: 'Full name' })
  fullName!: string;

  @ApiProperty({ description: 'Username' })
  username!: string;
}

export class PriceRecordResponseDto {
  @ApiProperty({ description: 'Price record ID' })
  id!: string;

  @ApiProperty({ description: 'Recorded price' })
  price!: number;

  @ApiProperty({ description: 'Date when price was recorded' })
  recordedAt!: Date;

  @ApiPropertyOptional({ description: 'Notes' })
  notes?: string | null;

  @ApiPropertyOptional({ description: 'Photo URL' })
  photoUrl?: string | null;

  @ApiProperty({ type: PriceRecordProductDto, description: 'Product information' })
  product!: PriceRecordProductDto;

  @ApiProperty({ type: PriceRecordStoreDto, description: 'Store information' })
  store!: PriceRecordStoreDto;

  @ApiProperty({ type: PriceRecordOperativeUserDto, description: 'Operative user who recorded' })
  operativeUser!: PriceRecordOperativeUserDto;
}

export class PriceRecordListResponseDto {
  @ApiProperty({ type: [PriceRecordResponseDto], description: 'List of price records' })
  data!: PriceRecordResponseDto[];

  @ApiProperty({ description: 'Total number of price records' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;
}
