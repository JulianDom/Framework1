import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationQueueService } from './services';
import { NOTIFICATION_QUEUE_SERVICE } from '@core/application/ports/services';

/**
 * QueueModule
 *
 * Módulo global para configuración de BullMQ con Redis.
 * Registra las colas necesarias para procesamiento asíncrono.
 *
 * Colas disponibles:
 * - notifications: Procesamiento de notificaciones push
 * - emails: Envío de correos electrónicos
 * - exports: Generación de reportes y exportaciones
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6380),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_DB', 0),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: {
            age: 3600, // Mantener jobs completados por 1 hora
            count: 1000, // Máximo 1000 jobs completados
          },
          removeOnFail: {
            age: 86400, // Mantener jobs fallidos por 24 horas
          },
        },
      }),
    }),
    // Registrar colas
    BullModule.registerQueue(
      { name: 'notifications' },
      { name: 'emails' },
      { name: 'exports' },
    ),
  ],
  providers: [
    NotificationQueueService,
    {
      provide: NOTIFICATION_QUEUE_SERVICE,
      useExisting: NotificationQueueService,
    },
  ],
  exports: [BullModule, NOTIFICATION_QUEUE_SERVICE],
})
export class QueueModule {}
