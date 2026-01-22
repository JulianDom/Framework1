import { IOperativeUserRepository } from '@core/application/ports/repositories';
import { IPasswordHasherService } from '@core/application/ports/services';
import { OperativeUserEntity } from '@core/domain/entities';
import { ConflictException } from '@shared/exceptions';

export interface CreateOperativeUserInput {
  fullName: string;
  email: string;
  username: string;
  password: string;
  createdById: string; // Admin que crea el usuario
}

export interface CreateOperativeUserOutput {
  id: string;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
  createdById: string | null;
}

/**
 * CreateOperativeUserUseCase
 *
 * Crea un nuevo usuario operativo con contraseña inicial.
 */
export class CreateOperativeUserUseCase {
  constructor(
    private readonly operativeUserRepository: IOperativeUserRepository,
    private readonly passwordHasher: IPasswordHasherService,
  ) {}

  async execute(input: CreateOperativeUserInput): Promise<CreateOperativeUserOutput> {
    // Verificar que no exista email duplicado
    const existsByEmail = await this.operativeUserRepository.existsByEmail(input.email);
    if (existsByEmail) {
      throw new ConflictException('An operative user with this email already exists');
    }

    // Verificar que no exista username duplicado
    const existsByUsername = await this.operativeUserRepository.existsByUsername(input.username);
    if (existsByUsername) {
      throw new ConflictException('An operative user with this username already exists');
    }

    // Hashear contraseña inicial
    const hashedPassword = await this.passwordHasher.hash(input.password);

    // Crear entidad
    const user = OperativeUserEntity.create({
      fullName: input.fullName,
      emailAddress: input.email,
      username: input.username,
      password: hashedPassword,
      enabled: true,
      createdById: input.createdById,
    });

    // Persistir
    const created = await this.operativeUserRepository.create(user);

    return {
      id: created.id!,
      fullName: created.fullName,
      email: created.emailAddress,
      username: created.username,
      enabled: created.enabled,
      createdById: created.createdById,
    };
  }
}
