import { Module } from '@nestjs/common';
import { GigsService } from './gigs.service.js';
import { AdminGigsController } from './controllers/admin-gigs.controller.js';
import { TaskerGigsController } from './controllers/tasker-gigs.controller.js';
import { ClientGigsController } from './controllers/client-gigs.controller.js';

@Module({
  controllers: [
    AdminGigsController,
    TaskerGigsController,
    ClientGigsController,
  ],
  providers: [GigsService],
  exports: [GigsService],
})
export class GigsModule {}
