import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infra/security/authentication';
import { RolesGuard } from '@presentation/guards';
import { Roles } from '@presentation/guards/decorators';
import { ActorType } from '@shared/types';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
  ListProductsUseCase,
  GetProductUseCase,
  ToggleProductStatusUseCase,
  ImportProductsFromExcelUseCase,
} from '@core/application/use-cases/products';
import {
  ProductPaginationQueryDto,
  CreateProductDto,
  UpdateProductDto,
  ToggleProductStatusDto,
  ImportProductsDto,
  ImportProductsResponseDto,
  ProductResponseDto,
  ProductDetailResponseDto,
  ProductListResponseDto,
} from './dto';

/**
 * ProductsController
 *
 * Épica 6: Gestión de Productos (Administrador)
 * - ABM de productos
 * - Importación de productos desde Excel
 * - Activación/desactivación de productos
 * - Prevención de duplicados según criterios definidos
 * - Productos diferenciados por presentación
 * - Precio siempre unitario
 */
@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ActorType.ADMIN)
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly toggleProductStatusUseCase: ToggleProductStatusUseCase,
    private readonly importProductsFromExcelUseCase: ImportProductsFromExcelUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List products with optional filters' })
  @ApiResponse({ status: 200, description: 'List of products', type: ProductListResponseDto })
  async listProducts(@Query() query: ProductPaginationQueryDto): Promise<ProductListResponseDto> {
    return this.listProductsUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      brand: query.brand,
      activeOnly: query.activeOnly,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product details', type: ProductDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string): Promise<ProductDetailResponseDto> {
    return this.getProductUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created', type: ProductResponseDto })
  @ApiResponse({ status: 409, description: 'SKU or name+presentation already exists' })
  async createProduct(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.createProductUseCase.execute({
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      barcode: dto.barcode,
      presentation: dto.presentation,
      unitPrice: dto.unitPrice,
      category: dto.category,
      brand: dto.brand,
      imageUrl: dto.imageUrl,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Name+presentation already exists' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.updateProductUseCase.execute({
      productId: id,
      name: dto.name,
      description: dto.description,
      barcode: dto.barcode,
      presentation: dto.presentation,
      unitPrice: dto.unitPrice,
      category: dto.category,
      brand: dto.brand,
      imageUrl: dto.imageUrl,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: ToggleProductStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() dto: ToggleProductStatusDto,
  ): Promise<ProductResponseDto> {
    return this.toggleProductStatusUseCase.execute({
      productId: id,
      activate: dto.activate,
    });
  }

  @Post('import')
  @ApiOperation({ summary: 'Import products from Excel data' })
  @ApiBody({ type: ImportProductsDto })
  @ApiResponse({ status: 201, description: 'Import results', type: ImportProductsResponseDto })
  async importProducts(@Body() dto: ImportProductsDto): Promise<ImportProductsResponseDto> {
    return this.importProductsFromExcelUseCase.execute({
      products: dto.products,
    });
  }
}
