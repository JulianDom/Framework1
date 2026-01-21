import { ActorType, TokenPair } from '@shared/types';

/**
 * Puerto para servicio de generación de tokens
 */
export interface ITokenGenerator {
  generateTokenPair(payload: {
    sub: string;
    email: string;
    username: string;
    type: ActorType;
  }): TokenPair;
}

export const TOKEN_GENERATOR = Symbol('ITokenGenerator');
