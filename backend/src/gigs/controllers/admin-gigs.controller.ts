import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GigsService } from '../gigs.service.js';
import { AdminUpdateGigStatusDto } from '../dto/admin/admin-update-gig-status.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('gigs/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminGigsController {
  constructor(private readonly gigsService: GigsService) {}

  // 1. View all gigs (Pending, Approved, Rejected) for review -> GET /gigs/admin/all
  @Get('all')
  async getAllGigs() {
    return this.gigsService.getAllGigsForAdmin();
  }

  // 2. Update gig status (Approve or Reject) -> PATCH /gigs/admin/:id/status
  @Patch(':id/status')
  async updateGigStatus(
    @Param('id') id: string,
    @Body() dto: AdminUpdateGigStatusDto,
  ) {
    return this.gigsService.updateGigStatus(id, dto.status);
  }
}
