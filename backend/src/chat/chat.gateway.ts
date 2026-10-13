import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 1. Client joins conversation room: e.g. client.emit('joinRoom', conversationId)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.join(conversationId);
    return { event: 'joined', conversationId };
  }

  // 2. Real-time message receive & broadcast: e.g. client.emit('sendMessage', { senderId, dto })
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: string; dto: SendMessageDto },
  ) {
    const result = await this.chatService.sendMessage(payload.senderId, payload.dto);

    // Broadcast new message live to all sockets in conversation room
    this.server.to(result.conversationId).emit('newMessage', result.chatMessage);

    return result;
  }
}
