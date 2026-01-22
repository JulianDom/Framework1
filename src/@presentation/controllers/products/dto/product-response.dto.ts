import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id!: string;

  @ApiProperty({ description: 'Product name' })
  name!: string;

  @ApiProperty({ description: 'Unique SKU' })
  sku!: string;

  @ApiProperty({ description: 'Presentation (e.g., 1L, 500g)' })
  presentation!: string;

  @ApiProperty({ description: 'Unit price' })
  unitPrice!: number;

  @ApiProperty({ description: 'Active status' })
  active!: boolean;
}

export class ProductDetailResponseDto extends ProductResponseDto {
  @ApiPropertyOptional({ description: 'Description' })
  description?: string | null;

  @ApiPropertyOptional({ description: 'Barcode' })
  barcode?: string | null;

  @ApiPropertyOptional({ description: 'Category' })
  category?: string | null;

  @ApiPropertyOptional({ description: 'Brand' })
  brand?: string | null;

  @ApiPropertyOptional({ description: 'Image URL' })
  imageUrl?: string | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class ProductListItemDto {
  @ApiProperty({ description: 'Product ID' })
  id!: string;

  @ApiProperty({ description: 'Product name' })
  name!: string;

  @ApiProperty({ description: 'Unique SKU' })
  sku!: string;

  @ApiProperty({ description: 'Presentation' })
  presentation!: string;

  @ApiProperty({ description: 'Unit price' })
  unitPrice!: number;

  @ApiPropertyOptional({ description: 'Category' })
  category?: string | null;

  @ApiPropertyOptional({ description: 'Brand' })
  brand?: string | null;

  @ApiProperty({ description: 'Active status' })
  active!: boolean;
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductListItemDto], description: 'List of products' })
  data!: ProductListItemDto[];

  @ApiProperty({ description: 'Total number of products' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;
}
