import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from '../profile.service.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 1. Authenticated user profile -> GET /profile/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req: any) {
    return this.profileService.getMyProfile(req.user.userId);
  }

  // 2. Update user profile -> PATCH /profile/me
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMyProfile(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateMyProfile(req.user.userId, dto);
  }

  // 3. View public profile of a user -> GET /profile/user/:id
  @Get('user/:id')
  async getPublicProfile(@Param('id') id: string) {
    return this.profileService.getPublicProfile(id);
  }
}
