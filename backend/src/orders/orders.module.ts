import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { ClientOrdersController } from './controllers/client-orders.controller.js';
import { TaskerOrdersController } from './controllers/tasker-orders.controller.js';
import { AdminOrdersController } from './controllers/admin-orders.controller.js';
import { WalletModule } from '../wallet/wallet.module.js';

@Module({
  imports: [WalletModule],
  controllers: [
    ClientOrdersController,
    TaskerOrdersController,
    AdminOrdersController,
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
