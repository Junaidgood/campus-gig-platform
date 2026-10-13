import { Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../notifications.service.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // 1. View all user notifications and unread count -> GET /notifications
  @Get()
  async getMyNotifications(@Request() req: any) {
    return this.notificationsService.getMyNotifications(req.user.userId);
  }

  // 2. Mark all notifications as read -> PATCH /notifications/read-all
  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  // 3. Mark a specific notification as read -> PATCH /notifications/:id/read
  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id);
  }
}
