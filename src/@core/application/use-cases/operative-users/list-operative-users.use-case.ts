import { IOperativeUserRepository } from '@core/application/ports/repositories';

export interface ListOperativeUsersInput {
  page?: number;
  limit?: number;
  createdById?: string; // Filtrar por admin que los creó
  enabledOnly?: boolean; // Filtrar solo habilitados
}

export interface OperativeUserListItem {
  id: string;
  fullName: string;
  email: string;
  username: string;
  enabled: boolean;
  createdById: string | null;
  createdAt: Date;
}

export interface ListOperativeUsersOutput {
  data: OperativeUserListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * ListOperativeUsersUseCase
 *
 * Lista todos los usuarios operativos con paginación.
 */
export class ListOperativeUsersUseCase {
  constructor(private readonly operativeUserRepository: IOperativeUserRepository) {}

  async execute(input: ListOperativeUsersInput): Promise<ListOperativeUsersOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    let result: { data: any[]; total: number };

    if (input.createdById) {
      // Filtrar por admin creador
      const users = await this.operativeUserRepository.findByCreatedBy(input.createdById);
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);
      result = { data: paginatedUsers, total: users.length };
    } else {
      // Con o sin filtro enabledOnly
      result = await this.operativeUserRepository.findAll(page, limit, input.enabledOnly);
    }

    return {
      data: result.data.map((user) => ({
        id: user.id!,
        fullName: user.fullName,
        email: user.emailAddress,
        username: user.username,
        enabled: user.enabled,
        createdById: user.createdById,
        createdAt: user.createdAt!,
      })),
      total: result.total,
      page,
      limit,
    };
  }
}