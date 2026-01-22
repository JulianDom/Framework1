import { IOperativeUserRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException, ConflictException } from '@shared/exceptions';

export interface UpdateOperativeUserInput {
  userId: string;
  fullName?: string;
  email?: string;
}

export interface UpdateOperativeUserOutput {
  id: string;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
}

/**
 * UpdateOperativeUserUseCase
 *
 * Actualiza los datos de un usuario operativo.
 */
export class UpdateOperativeUserUseCase {
  constructor(private readonly operativeUserRepository: IOperativeUserRepository) {}

  async execute(input: UpdateOperativeUserInput): Promise<UpdateOperativeUserOutput> {
    const user = await this.operativeUserRepository.findById(input.userId);

    if (!user) {
      throw new EntityNotFoundException('OperativeUser', input.userId);
    }

    // Verificar email único si se está cambiando
    if (input.email && input.email !== user.emailAddress) {
      const existsByEmail = await this.operativeUserRepository.existsByEmail(input.email);
      if (existsByEmail) {
        throw new ConflictException('An operative user with this email already exists');
      }
    }

    // Actualizar campos
    user.updateProfile({
      fullName: input.fullName,
      emailAddress: input.email,
    });

    const updateData: Record<string, unknown> = {};
    if (input.fullName) updateData['fullName'] = input.fullName;
    if (input.email) updateData['emailAddress'] = input.email;

    const updated = await this.operativeUserRepository.update(user.id!, updateData);

    return {
      id: updated.id!,
      fullName: updated.fullName,
      email: updated.emailAddress,
      username: updated.username,
      enabled: updated.enabled,
    };
  }
}
