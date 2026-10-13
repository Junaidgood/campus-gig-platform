import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TaskerCreateGigDto } from './dto/tasker/tasker-create-gig.dto.js';
import { GigStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class GigsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ====================================================================
  // 1. TASKER OPERATIONS
  // ====================================================================

  // Tasker creates a new gig (Default status: PENDING)
  async createGig(taskerId: string, dto: TaskerCreateGigDto) {
    const newGig = await this.prisma.gig.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        deliveryTime: dto.deliveryTime,
        status: GigStatus.APPROVED,
        taskerId: taskerId,
      },
      include: {
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      message: 'Your gig has been created and published live on the Campus Marketplace!',
      gig: newGig,
    };
  }

  // Tasker can view all their created gigs
  async getMyGigs(taskerId: string) {
    return this.prisma.gig.findMany({
      where: { taskerId: taskerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ====================================================================
  // 2. CLIENT / PUBLIC OPERATIONS
  // ====================================================================

  // Public / Clients: Retrieve only APPROVED gigs
  async getAllApprovedGigs(search?: string) {
    return this.prisma.gig.findMany({
      where: {
        status: GigStatus.APPROVED,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Client views specific gig details
  async getGigById(gigId: string) {
    const gig = await this.prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!gig || gig.status !== GigStatus.APPROVED) {
      throw new NotFoundException('Gig not found or not yet approved.');
    }

    return gig;
  }

  // ====================================================================
  // 3. ADMIN OPERATIONS
  // ====================================================================

  // Admin views all gigs (PENDING, APPROVED, REJECTED) for moderation
  async getAllGigsForAdmin() {
    return this.prisma.gig.findMany({
      include: {
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin updates gig status (APPROVED or REJECTED)
  async updateGigStatus(gigId: string, status: GigStatus) {
    const existingGig = await this.prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!existingGig) {
      throw new NotFoundException('Gig record not found!');
    }

    const updatedGig = await this.prisma.gig.update({
      where: { id: gigId },
      data: { status: status },
    });

    // Send notification to tasker
    if (status === GigStatus.APPROVED) {
      await this.notificationsService.createNotification(
        existingGig.taskerId,
        'Gig Approved!',
        `Your gig "${existingGig.title}" has been approved and is now live on the marketplace!`,
        NotificationType.GIG_APPROVED,
        `/gigs/client/${existingGig.id}`,
      );
    } else if (status === GigStatus.REJECTED) {
      await this.notificationsService.createNotification(
        existingGig.taskerId,
        'Gig Rejected',
        `Your gig "${existingGig.title}" has been rejected by the administrator.`,
        NotificationType.GIG_REJECTED,
      );
    }

    return {
      message: `Gig status has been successfully updated to ${status}!`,
      gig: updatedGig,
    };
  }
}
