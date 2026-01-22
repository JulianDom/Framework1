import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@infra/security/authentication';
import { RolesGuard } from '@presentation/guards';
import { Roles } from '@presentation/guards/decorators';
import { ActorType } from '@shared/types';
import {
  ListPriceRecordsUseCase,
  GetPriceRecordDetailUseCase,
  CreatePriceRecordUseCase,
} from '@core/application/use-cases/price-records';
import {
  PriceRecordPaginationQueryDto,
  PriceRecordResponseDto,
  PriceRecordListResponseDto,
  CreatePriceRecordDto,
  CreatePriceRecordResponseDto,
} from './dto';

/**
 * PriceRecordsController
 *
 * Épica 8: Visualización/Consumo de Precios
 * - Creación de registros de precios (Operativos)
 * - Visualización global de precios cargados (Administradores)
 * - Filtros básicos (fecha, local, producto, usuario)
 * - Acceso al detalle de relevamientos
 */
@ApiTags('price-records')
@Controller('price-records')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PriceRecordsController {
  constructor(
    private readonly listPriceRecordsUseCase: ListPriceRecordsUseCase,
    private readonly getPriceRecordDetailUseCase: GetPriceRecordDetailUseCase,
    private readonly createPriceRecordUseCase: CreatePriceRecordUseCase,
  ) { }

  @Post()
  @Roles(ActorType.USER, ActorType.ADMIN)
  @ApiOperation({ summary: 'Create a new price record (operative users and administrators)' })
  @ApiBody({ type: CreatePriceRecordDto })
  @ApiResponse({ status: 201, description: 'Price record created', type: CreatePriceRecordResponseDto })
  @ApiResponse({ status: 404, description: 'Product, Store or Operative User not found' })
  async createPriceRecord(
    @Request() req: any,
    @Body() dto: CreatePriceRecordDto,
  ): Promise<CreatePriceRecordResponseDto> {
    console.log('=== PRICE RECORD CONTROLLER DEBUG ===');
    console.log('req.user:', req.user);
    console.log('req.user.sub:', req.user?.sub);
    console.log('DTO:', dto);
    console.log('=====================================');

    return this.createPriceRecordUseCase.execute({
      productId: dto.productId,
      storeId: dto.storeId,
      operativeUserId: req.user.id,
      price: dto.price,
      recordedAt: dto.recordedAt,
      notes: dto.notes,
      photoUrl: dto.photoUrl,
    });
  }

  @Get()
  @Roles(ActorType.ADMIN)
  @ApiOperation({ summary: 'List price records with filters (read-only view)' })
  @ApiResponse({ status: 200, description: 'List of price records', type: PriceRecordListResponseDto })
  async listPriceRecords(
    @Query() query: PriceRecordPaginationQueryDto,
  ): Promise<PriceRecordListResponseDto> {
    return this.listPriceRecordsUseCase.execute({
      page: query.page,
      limit: query.limit,
      productId: query.productId,
      storeId: query.storeId,
      operativeUserId: query.operativeUserId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });
  }

  @Get(':id')
  @Roles(ActorType.ADMIN)
  @ApiOperation({ summary: 'Get price record detail (read-only)' })
  @ApiParam({ name: 'id', description: 'Price record ID' })
  @ApiResponse({ status: 200, description: 'Price record detail', type: PriceRecordResponseDto })
  @ApiResponse({ status: 404, description: 'Price record not found' })
  async getPriceRecordDetail(@Param('id') id: string): Promise<PriceRecordResponseDto> {
    return this.getPriceRecordDetailUseCase.execute(id);
  }
}
