import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders.service.js';
import { AdminCancelOrderDto } from '../dto/admin/admin-cancel-order.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('orders/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. View all platform orders -> GET /orders/admin/all
  @Get('all')
  async getAllOrders() {
    return this.ordersService.getAllOrdersForAdmin();
  }

  // 2. Cancel order on dispute/issue -> PATCH /orders/admin/:id/cancel
  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body() dto: AdminCancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(id, dto.reason);
  }
}
