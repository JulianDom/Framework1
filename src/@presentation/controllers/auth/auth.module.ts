import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { LoginUseCase, RegisterUseCase } from '@core/application/use-cases/auth';
import {
  USER_REPOSITORY,
  ADMINISTRATOR_REPOSITORY,
  IUserRepository,
  IAdministratorRepository,
} from '@core/application/ports/repositories';
import {
  REFRESH_TOKEN_SERVICE,
  IRefreshTokenService,
  PASSWORD_HASHER_SERVICE,
  IPasswordHasherService,
  TOKEN_GENERATOR,
  ITokenGenerator,
} from '@core/application/ports/services';
import { UserRepository, AdministratorRepository } from '@infra/database/repositories';
import { PasswordHasherService } from '@infra/security/encryption';
import { TokenService, RefreshTokenService } from '@infra/security/authentication';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { RolesGuard } from '@presentation/guards';
import { getJwtModuleConfig } from '@shared/config';

/**
 * AuthPresentationModule
 *
 * Módulo de presentación para autenticación.
 * Ensambla los use cases con sus dependencias siguiendo Clean Architecture:
 *
 * - Controller: Orquesta la petición HTTP
 * - Use Cases: Contienen la lógica de negocio
 * - Repositories: Abstraen el acceso a datos
 * - Services: Implementan operaciones de infraestructura
 *
 * Flujo de dependencias: Controller → UseCase → Repository/Service
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule, // Provides JwtAuthGuard, JwtStrategy, PassportModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtModuleConfig(configService),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Guards
    RolesGuard,

    // Repository Implementations (Adapters)
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ADMINISTRATOR_REPOSITORY,
      useClass: AdministratorRepository,
    },

    // Service Implementations (Adapters)
    {
      provide: PASSWORD_HASHER_SERVICE,
      useClass: PasswordHasherService,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: TokenService,
    },
    {
      provide: REFRESH_TOKEN_SERVICE,
      useClass: RefreshTokenService,
    },

    // TokenService needs to be available for injection
    TokenService,

    // Use Cases - Factory injection (Use Cases are framework-agnostic)
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: IUserRepository,
        adminRepo: IAdministratorRepository,
        passwordHasher: IPasswordHasherService,
        tokenGenerator: ITokenGenerator,
        refreshTokenService: IRefreshTokenService,
      ) => new LoginUseCase(userRepo, adminRepo, passwordHasher, tokenGenerator, refreshTokenService),
      inject: [USER_REPOSITORY, ADMINISTRATOR_REPOSITORY, PASSWORD_HASHER_SERVICE, TOKEN_GENERATOR, REFRESH_TOKEN_SERVICE],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepo: IUserRepository,
        adminRepo: IAdministratorRepository,
        passwordHasher: IPasswordHasherService,
        tokenGenerator: ITokenGenerator,
        refreshTokenService: IRefreshTokenService,
      ) => new RegisterUseCase(userRepo, adminRepo, passwordHasher, tokenGenerator, refreshTokenService),
      inject: [USER_REPOSITORY, ADMINISTRATOR_REPOSITORY, PASSWORD_HASHER_SERVICE, TOKEN_GENERATOR, REFRESH_TOKEN_SERVICE],
    },
  ],
  exports: [LoginUseCase, RegisterUseCase],
})
export class AuthPresentationModule {}
