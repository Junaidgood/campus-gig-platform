import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { GigStatus, OrderStatus, Role } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // 1. View authenticated user profile
  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        bio: true,
        skills: true,
        department: true,
        semester: true,
        avatarUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        phone: true,
        createdAt: true,
        wallet: {
          select: {
            balance: true,
          },
        },
        _count: {
          select: {
            gigs: true,
            clientOrders: true,
            taskerOrders: true,
            receivedReviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found!');
    }

    return user;
  }

  // 2. Update user profile (Bio, Skills, Department, Semester, Links)
  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName && { fullName: dto.fullName }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.skills !== undefined && { skills: dto.skills }),
        ...(dto.department !== undefined && { department: dto.department }),
        ...(dto.semester !== undefined && { semester: dto.semester }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
        ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        bio: true,
        skills: true,
        department: true,
        semester: true,
        avatarUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        phone: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Profile updated successfully!',
      user: updatedUser,
    };
  }

  // 3. View public profile for any user (Client / Tasker)
  async getPublicProfile(targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        fullName: true,
        role: true,
        email: true,
        bio: true,
        skills: true,
        department: true,
        semester: true,
        avatarUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        createdAt: true,
        // Include APPROVED gigs if user is a Tasker
        gigs: {
          where: { status: GigStatus.APPROVED },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            deliveryTime: true,
          },
        },
        // Received Reviews
        receivedReviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            client: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        // Completed orders count
        taskerOrders: {
          where: { status: OrderStatus.COMPLETED },
          select: { id: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Public profile not found!');
    }

    // Average rating calculation for Tasker
    const reviews = user.receivedReviews;
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
      department: user.department,
      semester: user.semester,
      avatarUrl: user.avatarUrl,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      memberSince: user.createdAt,
      completedOrdersCount: user.taskerOrders.length,
      ratingSummary: {
        averageRating,
        totalReviews,
      },
      gigs: user.gigs,
      reviews: user.receivedReviews,
    };
  }
}
