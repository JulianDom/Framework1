import { IOperativeUserRepository } from '@core/application/ports/repositories';
import { EntityNotFoundException } from '@shared/exceptions';

export interface ToggleOperativeUserStatusInput {
  userId: string;
  enable: boolean;
}

export interface ToggleOperativeUserStatusOutput {
  id: string;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
}

/**
 * ToggleOperativeUserStatusUseCase
 *
 * Habilita o deshabilita un usuario operativo.
 * El efecto es inmediato (invalida el refresh token al deshabilitar).
 */
export class ToggleOperativeUserStatusUseCase {
  constructor(private readonly operativeUserRepository: IOperativeUserRepository) { }

  async execute(input: ToggleOperativeUserStatusInput): Promise<ToggleOperativeUserStatusOutput> {
    const user = await this.operativeUserRepository.findById(input.userId);

    if (!user) {
      throw new EntityNotFoundException('OperativeUser', input.userId);
    }

    let updated;
    if (input.enable) {
      updated = await this.operativeUserRepository.enable(input.userId);
    } else {
      updated = await this.operativeUserRepository.disable(input.userId);
    }

    return {
      id: updated.id!,
      fullName: updated.fullName,
      email: updated.emailAddress,
      username: updated.username,
      enabled: updated.enabled,
    };
  }
}