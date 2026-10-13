import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ClientCreateOrderDto } from './dto/client/client-create-order.dto.js';
import { TaskerDeliverOrderDto } from './dto/tasker/tasker-deliver-order.dto.js';
import { GigStatus, NotificationType, OrderStatus } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private notificationsService: NotificationsService,
  ) {}

  // ====================================================================
  // 1. CLIENT OPERATIONS
  // ====================================================================

  // Client creates an order on an approved gig (Funds locked in Escrow)
  async createOrder(clientId: string, dto: ClientCreateOrderDto) {
    // 1. Check gig existence and status
    const gig = await this.prisma.gig.findUnique({
      where: { id: dto.gigId },
    });

    if (!gig) {
      throw new NotFoundException('Gig not found!');
    }

    if (gig.status !== GigStatus.APPROVED) {
      throw new BadRequestException('Orders can only be placed on APPROVED gigs!');
    }

    if (gig.taskerId === clientId) {
      throw new BadRequestException('You cannot place an order on your own gig!');
    }

    // 2. Verify client wallet has sufficient balance
    const clientWallet = await this.walletService.getOrCreateWallet(clientId);
    if (clientWallet.balance < gig.price) {
      throw new BadRequestException(
        `Your wallet balance is ${clientWallet.balance} PKR. Placing this order requires ${gig.price} PKR. Please deposit funds first!`,
      );
    }

    // 3. Calculate delivery date (Current date + gig.deliveryTime days)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + gig.deliveryTime);

    // 4. Create new order (Status: IN_PROGRESS)
    const newOrder = await this.prisma.order.create({
      data: {
        gigId: gig.id,
        clientId: clientId,
        taskerId: gig.taskerId,
        price: gig.price,
        requirements: dto.requirements,
        deliveryDate: deliveryDate,
        status: OrderStatus.IN_PROGRESS,
      },
      include: {
        gig: {
          select: {
            title: true,
            deliveryTime: true,
          },
        },
        tasker: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    // 5. Deduct funds from client wallet and lock in Escrow
    await this.walletService.lockEscrow(clientId, newOrder.id, gig.price);

    // Send notification to tasker for new order
    await this.notificationsService.createNotification(
      gig.taskerId,
      'New Order Received!',
      `You have received a new order worth ${gig.price} PKR for your gig "${gig.title}".`,
      NotificationType.ORDER_RECEIVED,
      `/orders/tasker/my-orders`,
    );

    return {
      message: `Order placed successfully! ${gig.price} PKR has been held in Escrow from your wallet.`,
      order: newOrder,
    };
  }

  // Client views all placed orders
  async getMyOrdersAsClient(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId: clientId },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            deliveryTime: true,
          },
        },
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Client accepts delivered work and completes order (Funds released to Tasker)
  async completeOrder(clientId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    if (order.clientId !== clientId) {
      throw new ForbiddenException('You can only complete your own orders!');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('This order has already been marked as COMPLETED!');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        `Order status is currently '${order.status}'. An order can only be completed after work has been DELIVERED by the tasker!`,
      );
    }

    // 1. Mark order status as COMPLETED
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    // 2. Release funds from escrow: credit 90% to tasker and deduct 10% platform fee
    const payout = await this.walletService.releaseEscrow(order.taskerId, order.id, order.price);

    // Send notification to tasker that order completed and payout released
    await this.notificationsService.createNotification(
      order.taskerId,
      'Order Complete & Payout Released!',
      `The client approved your work! ${payout.taskerEarnings} PKR has been credited to your wallet.`,
      NotificationType.PAYMENT_RECEIVED,
      `/wallet/tasker/my-wallet`,
    );

    return {
      message: `Order COMPLETED! ${payout.taskerEarnings} PKR has been transferred to the tasker (10% Platform fee: ${payout.platformFee} PKR).`,
      order: updatedOrder,
      payout,
    };
  }

  // ====================================================================
  // 2. TASKER OPERATIONS
  // ====================================================================

  // Tasker views all assigned orders
  async getMyOrdersAsTasker(taskerId: string) {
    return this.prisma.order.findMany({
      where: { taskerId: taskerId },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            deliveryTime: true,
          },
        },
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
        tasker: {
          select: {
            id: true,
            fullName: true,
            email: true,
            department: true,
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Tasker delivers completed work
  async deliverOrder(taskerId: string, orderId: string, dto: TaskerDeliverOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    if (order.taskerId !== taskerId) {
      throw new ForbiddenException('You can only deliver orders assigned to you!');
    }

    if (order.status !== OrderStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Order status is '${order.status}'. Only IN_PROGRESS orders can be delivered!`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.DELIVERED,
        deliveryNote: dto.deliveryNote,
      },
    });

    // Send notification to client that order has been delivered
    await this.notificationsService.createNotification(
      order.clientId,
      'Work Delivered!',
      'The tasker has submitted the work! Please review and approve.',
      NotificationType.ORDER_DELIVERED,
      `/orders/client/my-orders`,
    );

    return {
      message: 'Work has been successfully DELIVERED! Waiting for client review.',
      order: updatedOrder,
    };
  }

  // ====================================================================
  // 3. ADMIN OPERATIONS
  // ====================================================================

  // Admin views all platform orders
  async getAllOrdersForAdmin() {
    return this.prisma.order.findMany({
      include: {
        gig: {
          select: {
            title: true,
          },
        },
        client: {
          select: {
            fullName: true,
            email: true,
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

  // Admin cancels order due to dispute or issue (Refunds client)
  async cancelOrder(orderId: string, reason?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    // If order was IN_PROGRESS or DELIVERED, refund client escrow funds
    if (order.status === OrderStatus.IN_PROGRESS || order.status === OrderStatus.DELIVERED) {
      await this.walletService.refundEscrow(order.clientId, order.id, order.price);

      // Send notification to client
      await this.notificationsService.createNotification(
        order.clientId,
        'Order Cancelled & Refunded',
        `Your order has been cancelled and ${order.price} PKR has been refunded to your wallet.`,
        NotificationType.ORDER_CANCELLED,
        `/wallet/client/my-wallet`,
      );
    }

    // Send notification to tasker
    await this.notificationsService.createNotification(
      order.taskerId,
      'Order Cancelled',
      `The order has been cancelled.${reason ? ' Reason: ' + reason : ''}`,
      NotificationType.ORDER_CANCELLED,
    );

    return {
      message: `Order has been cancelled and ${order.price} PKR refunded to the client.${reason ? ' Reason: ' + reason : ''}`,
      order: updatedOrder,
    };
  }
}
