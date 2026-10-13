import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { WalletService } from '../wallet.service.js';
import { ClientDepositDto } from '../dto/client/client-deposit.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('wallet/client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientWalletController {
  constructor(private readonly walletService: WalletService) {}

  // 1. Client deposits funds into wallet -> POST /wallet/client/deposit
  @Post('deposit')
  async deposit(@Request() req: any, @Body() dto: ClientDepositDto) {
    return this.walletService.deposit(req.user.userId, dto);
  }

  // 2. Client views wallet balance and transactions -> GET /wallet/client/my-wallet
  @Get('my-wallet')
  async getMyWallet(@Request() req: any) {
    return this.walletService.getClientWallet(req.user.userId);
  }
}
