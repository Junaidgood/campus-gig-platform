import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders.service.js';
import { ClientCreateOrderDto } from '../dto/client/client-create-order.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('orders/client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. Client creates order on a gig -> POST /orders/client/create
  @Post('create')
  async createOrderWithAction(@Request() req: any, @Body() dto: ClientCreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  // Support POST /orders/client as well
  @Post()
  async createOrder(@Request() req: any, @Body() dto: ClientCreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  // 2. Client views all placed orders -> GET /orders/client/my-orders
  @Get('my-orders')
  async getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrdersAsClient(req.user.userId);
  }

  // 3. Client accepts and completes delivered order -> PATCH /orders/client/:id/complete
  @Patch(':id/complete')
  async completeOrder(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.completeOrder(req.user.userId, id);
  }
}
