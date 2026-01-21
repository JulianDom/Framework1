import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/**
 * PrismaService - Servicio de Base de Datos
 *
 * Extiende PrismaClient con lifecycle hooks de NestJS.
 *
 * NOTA: En Prisma 7+, la configuración del datasource se hace en prisma.config.ts,
 * no en el constructor de PrismaClient.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Prisma 7: datasource URL se configura en prisma/prisma.config.ts
    // Solo pasamos opciones de logging aquí
    super({
      log: process.env['NODE_ENV'] === 'development'
        ? [
            { emit: 'stdout', level: 'query' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
    });
  }

  async onModuleInit() {
    await this.$connect();
    // Log seguro: mostrar host pero ocultar credenciales
    const dbUrl = process.env['DATABASE_URL'] || '';
    const safeUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    this.logger.log(`Database connected: ${safeUrl.split('?')[0]}`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
