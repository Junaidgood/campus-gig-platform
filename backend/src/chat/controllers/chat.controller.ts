import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ChatService } from '../chat.service.js';
import { SendMessageDto } from '../dto/send-message.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 1. Send message (Direct message to Tasker/Client) -> POST /chat/send
  @Post('send')
  async sendMessage(@Request() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.userId, dto);
  }

  // 2. View user chat inbox / conversations -> GET /chat/conversations
  @Get('conversations')
  async getMyConversations(@Request() req: any) {
    return this.chatService.getMyConversations(req.user.userId);
  }

  // 3. View message history for a conversation -> GET /chat/conversations/:id/messages
  @Get('conversations/:id/messages')
  async getConversationMessages(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.chatService.getConversationMessages(req.user.userId, id);
  }
}
