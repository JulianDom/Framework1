import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitOfWorkService } from './unit-of-work.service';
import { UNIT_OF_WORK } from '@core/application/ports/services';

@Global()
@Module({
  providers: [
    PrismaService,
    UnitOfWorkService,
    {
      provide: UNIT_OF_WORK,
      useExisting: UnitOfWorkService,
    },
  ],
  exports: [PrismaService, UNIT_OF_WORK],
})
export class PrismaModule {}
