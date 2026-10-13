import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders.service.js';
import { TaskerDeliverOrderDto } from '../dto/tasker/tasker-deliver-order.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('orders/tasker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TASKER)
export class TaskerOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. Tasker views assigned orders -> GET /orders/tasker/my-orders
  @Get('my-orders')
  async getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrdersAsTasker(req.user.userId);
  }

  // 2. Tasker delivers completed work -> PATCH /orders/tasker/:id/deliver
  @Patch(':id/deliver')
  async deliverOrder(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: TaskerDeliverOrderDto,
  ) {
    return this.ordersService.deliverOrder(req.user.userId, id, dto);
  }
}
