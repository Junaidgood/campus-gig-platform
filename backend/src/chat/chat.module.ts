import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './controllers/chat.controller.js';
import { ChatGateway } from './chat.gateway.js';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
