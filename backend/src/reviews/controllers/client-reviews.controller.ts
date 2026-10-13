import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../reviews.service.js';
import { ClientCreateReviewDto } from '../dto/client/client-create-review.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('reviews/client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. Client submits review and rating for completed order -> POST /reviews/client/create
  @Post('create')
  async createReview(@Request() req: any, @Body() dto: ClientCreateReviewDto) {
    return this.reviewsService.createReview(req.user.userId, dto);
  }

  // 2. Client views their submitted reviews -> GET /reviews/client/my-reviews
  @Get('my-reviews')
  async getMyGivenReviews(@Request() req: any) {
    return this.reviewsService.getMyGivenReviews(req.user.userId);
  }
}
