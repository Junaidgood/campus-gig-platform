import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service.js';
import { ClientWalletController } from './controllers/client-wallet.controller.js';
import { TaskerWalletController } from './controllers/tasker-wallet.controller.js';
import { AdminWalletController } from './controllers/admin-wallet.controller.js';

@Module({
  controllers: [
    ClientWalletController,
    TaskerWalletController,
    AdminWalletController,
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
