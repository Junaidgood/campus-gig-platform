import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ClientDepositDto } from './dto/client/client-deposit.dto.js';
import { TaskerWithdrawDto } from './dto/tasker/tasker-withdraw.dto.js';
import { AdminReviewWithdrawDto } from './dto/admin/admin-review-withdraw.dto.js';
import { TransactionType, WithdrawalStatus } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // Helper: Find user wallet or create if it doesn't exist
  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId: userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId: userId,
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
    }

    return wallet;
  }

  // ====================================================================
  // 1. CLIENT WALLET OPERATIONS
  // ====================================================================

  // Client deposits funds into wallet
  async deposit(clientId: string, dto: ClientDepositDto) {
    const wallet = await this.getOrCreateWallet(clientId);

    const updatedWallet = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: dto.amount },
        transactions: {
          create: {
            amount: dto.amount,
            type: TransactionType.DEPOSIT,
            description: `${dto.amount} PKR deposited into wallet.`,
          },
        },
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return {
      message: `${dto.amount} PKR added successfully to your wallet!`,
      currentBalance: updatedWallet.balance,
      wallet: updatedWallet,
    };
  }

  // Client views wallet balance and transaction history
  async getClientWallet(clientId: string) {
    return this.getOrCreateWallet(clientId);
  }

  // ====================================================================
  // 2. TASKER WALLET OPERATIONS
  // ====================================================================

  // Tasker views balance, earnings, and withdrawal history
  async getTaskerWallet(taskerId: string) {
    const wallet = await this.getOrCreateWallet(taskerId);
    const withdrawals = await this.prisma.withdrawalRequest.findMany({
      where: { taskerId: taskerId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      wallet,
      withdrawalHistory: withdrawals,
    };
  }

  // Tasker submits a withdrawal request
  async requestWithdrawal(taskerId: string, dto: TaskerWithdrawDto) {
    const wallet = await this.getOrCreateWallet(taskerId);

    if (wallet.balance < dto.amount) {
      throw new BadRequestException(
        `Your balance is ${wallet.balance} PKR. You cannot withdraw ${dto.amount} PKR!`,
      );
    }

    // Deduct amount from balance and create pending withdrawal request
    const [updatedWallet, withdrawalRequest] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: dto.amount },
          transactions: {
            create: {
              amount: dto.amount,
              type: TransactionType.WITHDRAWAL,
              description: `Withdrawal request: ${dto.paymentMethod} (${dto.accountNumber})`,
            },
          },
        },
      }),
      this.prisma.withdrawalRequest.create({
        data: {
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          accountNumber: dto.accountNumber,
          accountTitle: dto.accountTitle,
          status: WithdrawalStatus.PENDING,
          taskerId: taskerId,
        },
      }),
    ]);

    return {
      message: `Withdrawal request for ${dto.amount} PKR submitted successfully! Admin will review shortly.`,
      remainingBalance: updatedWallet.balance,
      withdrawal: withdrawalRequest,
    };
  }

  // ====================================================================
  // 3. ADMIN WALLET & WITHDRAWAL REVIEW
  // ====================================================================

  // Admin views all withdrawal requests
  async getAllWithdrawals() {
    return this.prisma.withdrawalRequest.findMany({
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

  // Admin reviews withdrawal request (Approve or Reject)
  async reviewWithdrawal(requestId: string, dto: AdminReviewWithdrawDto) {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Withdrawal request not found!');
    }

    if (request.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('This withdrawal request has already been reviewed!');
    }

    // If rejected, refund withdrawal amount back to tasker wallet
    if (dto.status === WithdrawalStatus.REJECTED) {
      const taskerWallet = await this.getOrCreateWallet(request.taskerId);

      await this.prisma.$transaction([
        this.prisma.withdrawalRequest.update({
          where: { id: requestId },
          data: {
            status: WithdrawalStatus.REJECTED,
            adminNote: dto.adminNote,
          },
        }),
        this.prisma.wallet.update({
          where: { id: taskerWallet.id },
          data: {
            balance: { increment: request.amount },
            transactions: {
              create: {
                amount: request.amount,
                type: TransactionType.REFUND,
                description: `Refunded ${request.amount} PKR due to rejected withdrawal. Reason: ${dto.adminNote || 'None'}`,
              },
            },
          },
        }),
      ]);

      return {
        message: 'Withdrawal request has been REJECTED and funds refunded to the tasker.',
      };
    }

    // If approved
    const updated = await this.prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: WithdrawalStatus.APPROVED,
        adminNote: dto.adminNote,
      },
    });

    return {
      message: 'Withdrawal request has been APPROVED successfully!',
      withdrawal: updated,
    };
  }

  // ====================================================================
  // 4. ESCROW METHODS (Orders Module)
  // ====================================================================

  // Hold client funds in escrow when order is placed
  async lockEscrow(clientId: string, orderId: string, amount: number) {
    const wallet = await this.getOrCreateWallet(clientId);

    if (wallet.balance < amount) {
      throw new BadRequestException(
        `Insufficient wallet balance (${wallet.balance} PKR). Please deposit at least ${amount} PKR to place this order!`,
      );
    }

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            amount: amount,
            type: TransactionType.ESCROW_LOCK,
            orderId: orderId,
            description: `Locked ${amount} PKR in Escrow for order.`,
          },
        },
      },
    });
  }

  // Release funds from escrow to tasker when order is COMPLETED (minus 10% commission)
  async releaseEscrow(taskerId: string, orderId: string, totalAmount: number) {
    const taskerWallet = await this.getOrCreateWallet(taskerId);

    const platformFee = Math.round(totalAmount * 0.10); // 10% platform commission
    const taskerEarnings = totalAmount - platformFee;

    await this.prisma.wallet.update({
      where: { id: taskerWallet.id },
      data: {
        balance: { increment: taskerEarnings },
        transactions: {
          create: {
            amount: taskerEarnings,
            type: TransactionType.ORDER_PAYOUT,
            orderId: orderId,
            description: `Order payout: ${taskerEarnings} PKR credited (Platform fee 10%: ${platformFee} PKR).`,
          },
        },
      },
    });

    return {
      totalAmount,
      platformFee,
      taskerEarnings,
    };
  }

  // Refund escrow funds back to client when order is CANCELLED
  async refundEscrow(clientId: string, orderId: string, amount: number) {
    const wallet = await this.getOrCreateWallet(clientId);

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            amount: amount,
            type: TransactionType.REFUND,
            orderId: orderId,
            description: `Refunded ${amount} PKR due to order cancellation.`,
          },
        },
      },
    });
  }
}
