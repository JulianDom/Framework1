import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUseCase, RegisterUseCase } from '@core/application/use-cases/auth';
import { ActorType } from '@shared/types';
import { LoginDto, RegisterUserDto, RegisterAdminDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from '@infra/security/authentication';
import { RolesGuard } from '@presentation/guards';
import { Roles } from '@presentation/guards/decorators';

/**
 * AuthController
 *
 * Controller para autenticación.
 * Solo orquesta - la lógica de negocio está en los Use Cases.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login for users and administrators' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
      actorType: dto.actorType,
    });

    return {
      actor: result.actor,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async registerUser(@Body() dto: RegisterUserDto): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.registerUser({
      fullName: dto.fullName,
      email: dto.email,
      username: dto.username,
      password: dto.password,
      language: dto.language,
    });

    return {
      actor: result.actor,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }

  @Post('register/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ActorType.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register a new administrator (requires ADMIN role)' })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({ status: 201, description: 'Administrator registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Admin role required' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async registerAdmin(@Body() dto: RegisterAdminDto): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.registerAdmin({
      fullName: dto.fullName,
      email: dto.email,
      username: dto.username,
      password: dto.password,
    });

    return {
      actor: result.actor,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }
}
