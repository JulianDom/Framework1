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
  CreateStoreUseCase,
  UpdateStoreUseCase,
  ListStoresUseCase,
  GetStoreUseCase,
  ToggleStoreStatusUseCase,
  ImportStoresFromExcelUseCase,
} from '@core/application/use-cases/stores';
import {
  StorePaginationQueryDto,
  CreateStoreDto,
  UpdateStoreDto,
  ToggleStoreStatusDto,
  ImportStoresDto,
  ImportStoresResponseDto,
  StoreResponseDto,
  StoreDetailResponseDto,
  StoreListResponseDto,
} from './dto';

/**
 * StoresController
 *
 * Épica 7: Gestión de Locales (Administrador)
 * - Listado completo de locales
 * - Alta, edición y desactivación manual
 * - Importación de locales desde Excel
 * - Validación de duplicados
 * - Todos los locales activos por defecto
 */
@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ActorType.ADMIN)
@ApiBearerAuth('JWT-auth')
export class StoresController {
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly updateStoreUseCase: UpdateStoreUseCase,
    private readonly listStoresUseCase: ListStoresUseCase,
    private readonly getStoreUseCase: GetStoreUseCase,
    private readonly toggleStoreStatusUseCase: ToggleStoreStatusUseCase,
    private readonly importStoresFromExcelUseCase: ImportStoresFromExcelUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List stores with optional filters' })
  @ApiResponse({ status: 200, description: 'List of stores', type: StoreListResponseDto })
  async listStores(@Query() query: StorePaginationQueryDto): Promise<StoreListResponseDto> {
    return this.listStoresUseCase.execute({
      page: query.page,
      limit: query.limit,
      search: query.search,
      city: query.city,
      activeOnly: query.activeOnly,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({ status: 200, description: 'Store details', type: StoreDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStore(@Param('id') id: string): Promise<StoreDetailResponseDto> {
    return this.getStoreUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store (active by default)' })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({ status: 201, description: 'Store created', type: StoreResponseDto })
  @ApiResponse({ status: 409, description: 'Code or name+address already exists' })
  async createStore(@Body() dto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.createStoreUseCase.execute({
      name: dto.name,
      code: dto.code,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      country: dto.country,
      latitude: dto.latitude,
      longitude: dto.longitude,
      phone: dto.phone,
      email: dto.email,
      metadata: dto.metadata,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({ status: 200, description: 'Store updated', type: StoreResponseDto })
  @ApiResponse({ status: 404, description: 'Store not found' })
  @ApiResponse({ status: 409, description: 'Name+address already exists' })
  async updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.updateStoreUseCase.execute({
      storeId: id,
      name: dto.name,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      country: dto.country,
      latitude: dto.latitude,
      longitude: dto.longitude,
      phone: dto.phone,
      email: dto.email,
      metadata: dto.metadata,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiBody({ type: ToggleStoreStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated', type: StoreResponseDto })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() dto: ToggleStoreStatusDto,
  ): Promise<StoreResponseDto> {
    return this.toggleStoreStatusUseCase.execute({
      storeId: id,
      activate: dto.activate,
    });
  }

  @Post('import')
  @ApiOperation({ summary: 'Import stores from Excel data (all active by default)' })
  @ApiBody({ type: ImportStoresDto })
  @ApiResponse({ status: 201, description: 'Import results', type: ImportStoresResponseDto })
  async importStores(@Body() dto: ImportStoresDto): Promise<ImportStoresResponseDto> {
    return this.importStoresFromExcelUseCase.execute({
      stores: dto.stores,
    });
  }
}
