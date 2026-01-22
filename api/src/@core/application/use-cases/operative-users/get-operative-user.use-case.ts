import { IOperativeUserRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface GetOperativeUserOutput {
  id: string;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GetOperativeUserUseCase
 *
 * Obtiene los detalles de un usuario operativo por ID.
 */
export class GetOperativeUserUseCase {
  constructor(private readonly operativeUserRepository: IOperativeUserRepository) {}

  async execute(userId: string): Promise<GetOperativeUserOutput> {
    const user = await this.operativeUserRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundException('OperativeUser', userId);
    }

    return {
      id: user.id!,
      fullName: user.fullName,
      email: user.emailAddress,
      username: user.username,
      enabled: user.enabled,
      createdById: user.createdById,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}