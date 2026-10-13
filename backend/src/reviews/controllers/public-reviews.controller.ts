import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from '../reviews.service.js';

@Controller('reviews')
export class PublicReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. View all reviews and average rating for a gig -> GET /reviews/gig/:gigId
  @Get('gig/:gigId')
  async getGigReviews(@Param('gigId') gigId: string) {
    return this.reviewsService.getGigReviews(gigId);
  }

  // 2. View all reviews for a tasker -> GET /reviews/tasker/:taskerId
  @Get('tasker/:taskerId')
  async getTaskerReviews(@Param('taskerId') taskerId: string) {
    return this.reviewsService.getTaskerPublicProfileReviews(taskerId);
  }
}
