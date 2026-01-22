import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OperativeUsersController } from './operative-users.controller';
import {
  CreateOperativeUserUseCase,
  UpdateOperativeUserUseCase,
  ListOperativeUsersUseCase,
  GetOperativeUserUseCase,
  ToggleOperativeUserStatusUseCase,
} from '@core/application/use-cases/operative-users';
import {
  OPERATIVE_USER_REPOSITORY,
  IOperativeUserRepository,
} from '@core/application/ports/repositories';
import {
  PASSWORD_HASHER_SERVICE,
  IPasswordHasherService,
} from '@core/application/ports/services';
import { OperativeUserRepository } from '@infra/database/repositories';
import { PasswordHasherService } from '@infra/security/encryption';
import { PrismaModule } from '@infra/database/prisma';
import { AuthModule } from '@infra/security/auth.module';
import { RolesGuard } from '@presentation/guards';
import { getJwtModuleConfig } from '@shared/config';

/**
 * OperativeUsersPresentationModule
 *
 * Épica 5: Gestión de Usuarios (Administrador → Personal Operativo)
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getJwtModuleConfig(configService),
    }),
  ],
  controllers: [OperativeUsersController],
  providers: [
    RolesGuard,

    // Repository
    {
      provide: OPERATIVE_USER_REPOSITORY,
      useClass: OperativeUserRepository,
    },

    // Services
    {
      provide: PASSWORD_HASHER_SERVICE,
      useClass: PasswordHasherService,
    },

    // Use Cases
    {
      provide: CreateOperativeUserUseCase,
      useFactory: (
        operativeUserRepo: IOperativeUserRepository,
        passwordHasher: IPasswordHasherService,
      ) => new CreateOperativeUserUseCase(operativeUserRepo, passwordHasher),
      inject: [OPERATIVE_USER_REPOSITORY, PASSWORD_HASHER_SERVICE],
    },
    {
      provide: UpdateOperativeUserUseCase,
      useFactory: (operativeUserRepo: IOperativeUserRepository) =>
        new UpdateOperativeUserUseCase(operativeUserRepo),
      inject: [OPERATIVE_USER_REPOSITORY],
    },
    {
      provide: ListOperativeUsersUseCase,
      useFactory: (operativeUserRepo: IOperativeUserRepository) =>
        new ListOperativeUsersUseCase(operativeUserRepo),
      inject: [OPERATIVE_USER_REPOSITORY],
    },
    {
      provide: GetOperativeUserUseCase,
      useFactory: (operativeUserRepo: IOperativeUserRepository) =>
        new GetOperativeUserUseCase(operativeUserRepo),
      inject: [OPERATIVE_USER_REPOSITORY],
    },
    {
      provide: ToggleOperativeUserStatusUseCase,
      useFactory: (operativeUserRepo: IOperativeUserRepository) =>
        new ToggleOperativeUserStatusUseCase(operativeUserRepo),
      inject: [OPERATIVE_USER_REPOSITORY],
    },
  ],
})
export class OperativeUsersPresentationModule {}
