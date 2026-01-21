import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, AuthenticatedActor, ActorType } from '@shared/types';
import { PrismaService } from '@infra/database/prisma';
import { getJwtSecret } from '@shared/config';

/**
 * JwtStrategy
 *
 * Estrategia de autenticación JWT para Passport.
 * Valida tokens y carga el actor (User o Administrator).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(configService),
    });
  }

  /**
   * Valida el payload del token JWT
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedActor> {
    const { sub: id, type } = payload;

    // Verificar que el actor existe y no está eliminado
    if (type === ActorType.USER) {
      const user = await this.prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (!user) {
        throw new UnauthorizedException('User not found or deactivated');
      }

      return {
        id: user.id,
        email: user.emailAddress,
        username: user.username,
        type: ActorType.USER,
      };
    }

    if (type === ActorType.ADMIN) {
      const admin = await this.prisma.administrator.findFirst({
        where: { id, deletedAt: null, enabled: true },
      });

      if (!admin) {
        throw new UnauthorizedException('Administrator not found or disabled');
      }

      return {
        id: admin.id,
        email: admin.emailAddress,
        username: admin.username,
        type: ActorType.ADMIN,
      };
    }

    throw new UnauthorizedException('Invalid token type');
  }
}
