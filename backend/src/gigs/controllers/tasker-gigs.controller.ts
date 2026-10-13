import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { GigsService } from '../gigs.service.js';
import { TaskerCreateGigDto } from '../dto/tasker/tasker-create-gig.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('gigs/tasker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TASKER)
export class TaskerGigsController {
  constructor(private readonly gigsService: GigsService) {}

  // 1. Tasker creates a gig -> POST /gigs/tasker/create
  @Post('create')
  async createGigWithAction(@Request() req: any, @Body() dto: TaskerCreateGigDto) {
    return this.gigsService.createGig(req.user.userId, dto);
  }

  // Support POST /gigs/tasker as well
  @Post()
  async createGig(@Request() req: any, @Body() dto: TaskerCreateGigDto) {
    return this.gigsService.createGig(req.user.userId, dto);
  }

  // 2. Tasker views their own created gigs -> GET /gigs/tasker/my-gigs
  @Get('my-gigs')
  async getMyGigs(@Request() req: any) {
    return this.gigsService.getMyGigs(req.user.userId);
  }
}
