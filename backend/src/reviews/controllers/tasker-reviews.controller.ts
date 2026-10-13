import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../reviews.service.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('reviews/tasker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TASKER)
export class TaskerReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. Tasker views received reviews and average rating -> GET /reviews/tasker/my-reviews
  @Get('my-reviews')
  async getMyReceivedReviews(@Request() req: any) {
    return this.reviewsService.getMyReceivedReviews(req.user.userId);
  }
}
