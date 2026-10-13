import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ClientReviewsController } from './controllers/client-reviews.controller.js';
import { TaskerReviewsController } from './controllers/tasker-reviews.controller.js';
import { PublicReviewsController } from './controllers/public-reviews.controller.js';

@Module({
  controllers: [
    ClientReviewsController,
    TaskerReviewsController,
    PublicReviewsController,
  ],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
