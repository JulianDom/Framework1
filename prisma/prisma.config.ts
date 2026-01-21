import 'dotenv/config'

/**
 * Prisma 7 Configuration
 *
 * En Prisma 7, la URL de conexión se mueve de schema.prisma a prisma.config.ts
 * y se pasa al constructor de PrismaClient.
 *
 * Documentación: https://pris.ly/d/prisma7-client-config
 */
export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
   url: process.env.DATABASE_URL,
   
  },
}