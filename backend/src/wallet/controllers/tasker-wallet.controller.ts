import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { WalletService } from '../wallet.service.js';
import { TaskerWithdrawDto } from '../dto/tasker/tasker-withdraw.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('wallet/tasker')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TASKER)
export class TaskerWalletController {
  constructor(private readonly walletService: WalletService) {}

  // 1. Tasker views wallet, balance, and earnings -> GET /wallet/tasker/my-wallet
  @Get('my-wallet')
  async getMyWallet(@Request() req: any) {
    return this.walletService.getTaskerWallet(req.user.userId);
  }

  // 2. Tasker submits withdrawal request -> POST /wallet/tasker/withdraw
  @Post('withdraw')
  async requestWithdrawal(@Request() req: any, @Body() dto: TaskerWithdrawDto) {
    return this.walletService.requestWithdrawal(req.user.userId, dto);
  }
}
