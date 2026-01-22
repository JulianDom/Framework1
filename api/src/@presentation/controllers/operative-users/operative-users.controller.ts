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
  Request,
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
  CreateOperativeUserUseCase,
  UpdateOperativeUserUseCase,
  ListOperativeUsersUseCase,
  GetOperativeUserUseCase,
  ToggleOperativeUserStatusUseCase,
} from '@core/application/use-cases/operative-users';
import {
  OperativeUserPaginationQueryDto,
  CreateOperativeUserDto,
  UpdateOperativeUserDto,
  ToggleOperativeUserStatusDto,
  OperativeUserResponseDto,
  OperativeUserDetailResponseDto,
  OperativeUserListResponseDto,
} from './dto';

/**
 * OperativeUsersController
 *
 * Épica 5: Gestión de Usuarios (Administrador → Personal Operativo)
 * - Alta de usuarios operativos con contraseña inicial
 * - Edición de datos
 * - Habilitar/deshabilitar usuarios con efecto inmediato
 * - No existe eliminación definitiva de usuarios
 */
@ApiTags('operative-users')
@Controller('operative-users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ActorType.ADMIN)
@ApiBearerAuth('JWT-auth')
export class OperativeUsersController {
  constructor(
    private readonly createOperativeUserUseCase: CreateOperativeUserUseCase,
    private readonly updateOperativeUserUseCase: UpdateOperativeUserUseCase,
    private readonly listOperativeUsersUseCase: ListOperativeUsersUseCase,
    private readonly getOperativeUserUseCase: GetOperativeUserUseCase,
    private readonly toggleOperativeUserStatusUseCase: ToggleOperativeUserStatusUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all operative users' })
  @ApiResponse({ status: 200, description: 'List of operative users', type: OperativeUserListResponseDto })
  async listOperativeUsers(
    @Query() query: OperativeUserPaginationQueryDto,
  ): Promise<OperativeUserListResponseDto> {
    return this.listOperativeUsersUseCase.execute({
      page: query.page,
      limit: query.limit,
      createdById: query.createdById,
      enabledOnly: query.activeOnly,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get operative user by ID' })
  @ApiParam({ name: 'id', description: 'Operative user ID' })
  @ApiResponse({ status: 200, description: 'Operative user details', type: OperativeUserDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Operative user not found' })
  async getOperativeUser(@Param('id') id: string): Promise<OperativeUserDetailResponseDto> {
    return this.getOperativeUserUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new operative user with initial password' })
  @ApiBody({ type: CreateOperativeUserDto })
  @ApiResponse({ status: 201, description: 'Operative user created', type: OperativeUserResponseDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async createOperativeUser(
    @Request() req: any,
    @Body() dto: CreateOperativeUserDto,
  ): Promise<OperativeUserResponseDto> {
    return this.createOperativeUserUseCase.execute({
      fullName: dto.fullName,
      email: dto.email,
      username: dto.username,
      password: dto.password,
      createdById: req.user.sub,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an operative user' })
  @ApiParam({ name: 'id', description: 'Operative user ID' })
  @ApiBody({ type: UpdateOperativeUserDto })
  @ApiResponse({ status: 200, description: 'Operative user updated', type: OperativeUserResponseDto })
  @ApiResponse({ status: 404, description: 'Operative user not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateOperativeUser(
    @Param('id') id: string,
    @Body() dto: UpdateOperativeUserDto,
  ): Promise<OperativeUserResponseDto> {
    return this.updateOperativeUserUseCase.execute({
      userId: id,
      fullName: dto.fullName,
      email: dto.email,
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Enable or disable an operative user (immediate effect)' })
  @ApiParam({ name: 'id', description: 'Operative user ID' })
  @ApiBody({ type: ToggleOperativeUserStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated', type: OperativeUserResponseDto })
  @ApiResponse({ status: 404, description: 'Operative user not found' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() dto: ToggleOperativeUserStatusDto,
  ): Promise<OperativeUserResponseDto> {
    return this.toggleOperativeUserStatusUseCase.execute({
      userId: id,
      enable: dto.enable,
    });
  }
}
