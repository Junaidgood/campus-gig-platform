import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ClientCreateReviewDto } from './dto/client/client-create-review.dto.js';
import { NotificationType, OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ====================================================================
  // 1. CLIENT OPERATIONS
  // ====================================================================

  // Client submits review and rating for a completed order
  async createReview(clientId: string, dto: ClientCreateReviewDto) {
    // 1. Find order
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    // 2. Ensure only the ordering client can review
    if (order.clientId !== clientId) {
      throw new ForbiddenException('You can only submit reviews for your own orders!');
    }

    // 3. Order must be COMPLETED before reviewing
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException(
        `Order status is '${order.status}'. Reviews can only be submitted for COMPLETED orders!`,
      );
    }

    // 4. Check if a review already exists for this order
    const existingReview = await this.prisma.review.findUnique({
      where: { orderId: dto.orderId },
    });

    if (existingReview) {
      throw new ConflictException('A review has already been submitted for this order!');
    }

    // 5. Create review
    const newReview = await this.prisma.review.create({
      data: {
        orderId: order.id,
        gigId: order.gigId,
        clientId: clientId,
        taskerId: order.taskerId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        client: {
          select: {
            fullName: true,
            email: true,
          },
        },
        gig: {
          select: {
            title: true,
          },
        },
      },
    });

    // Send notification to tasker
    await this.notificationsService.createNotification(
      order.taskerId,
      'New Review Received!',
      `${newReview.client.fullName} gave you a ⭐ ${dto.rating}-star review: "${dto.comment}"`,
      NotificationType.NEW_REVIEW,
      `/reviews/tasker/my-reviews`,
    );

    return {
      message: 'Your review has been submitted successfully! Thank you.',
      review: newReview,
    };
  }

  // Client views all reviews they have given
  async getMyGivenReviews(clientId: string) {
    return this.prisma.review.findMany({
      where: { clientId: clientId },
      include: {
        gig: {
          select: {
            title: true,
          },
        },
        tasker: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ====================================================================
  // 2. TASKER OPERATIONS
  // ====================================================================

  // Tasker views received reviews and average rating
  async getMyReceivedReviews(taskerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { taskerId: taskerId },
      include: {
        client: {
          select: {
            fullName: true,
          },
        },
        gig: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
      totalReviews,
      averageRating,
      reviews,
    };
  }

  // ====================================================================
  // 3. PUBLIC / MARKETPLACE OPERATIONS (Anyone can view)
  // ====================================================================

  // View all reviews and average rating for a specific gig
  async getGigReviews(gigId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { gigId: gigId },
      include: {
        client: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
      totalReviews,
      averageRating,
      reviews,
    };
  }

  // View public reviews for a tasker profile
  async getTaskerPublicProfileReviews(taskerId: string) {
    return this.getMyReceivedReviews(taskerId);
  }
}
