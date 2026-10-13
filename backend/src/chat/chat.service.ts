import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Helper: Find or create conversation between two users
  async getOrCreateConversation(
    userAId: string,
    userBId: string,
    gigId?: string,
    orderId?: string,
  ) {
    // Sort user IDs to enforce database uniqueness constraint
    const [u1, u2] = [userAId, userBId].sort();

    let conversation = await this.prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: u1,
          user2Id: u2,
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          user1Id: u1,
          user2Id: u2,
          gigId: gigId,
          orderId: orderId,
        },
      });
    }

    return conversation;
  }

  // 1. Send message (Direct conversation create/append)
  async sendMessage(senderId: string, dto: SendMessageDto) {
    if (senderId === dto.recipientId) {
      throw new BadRequestException('You cannot send a message to yourself!');
    }

    // Check recipient user exists
    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient user not found!');
    }

    // Find or create conversation
    const conversation = await this.getOrCreateConversation(
      senderId,
      dto.recipientId,
      dto.gigId,
      dto.orderId,
    );

    // Save message
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: senderId,
        text: dto.text,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    // Update lastMessageAt on conversation
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return {
      message: 'Message sent successfully!',
      conversationId: conversation.id,
      chatMessage: message,
    };
  }

  // 2. View all active user conversations (Inbox)
  async getMyConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: { id: true, fullName: true, role: true, email: true },
        },
        user2: {
          select: { id: true, fullName: true, role: true, email: true },
        },
        gig: {
          select: { id: true, title: true },
        },
        order: {
          select: { id: true, status: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Latest message snippet
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Extract otherUser for caller convenience
    return conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      return {
        conversationId: conv.id,
        otherUser,
        gig: conv.gig,
        order: conv.order,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: conv.lastMessageAt,
      };
    });
  }

  // 3. View message history for a specific conversation
  async getConversationMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found!');
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new ForbiddenException('You do not have permission to view this chat!');
    }

    // Fetch all messages
    const messages = await this.prisma.message.findMany({
      where: { conversationId: conversationId },
      include: {
        sender: {
          select: { id: true, fullName: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return {
      conversationId: conversation.id,
      messages,
    };
  }
}
