import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { WalletService } from '../wallet.service.js';
import { AdminReviewWithdrawDto } from '../dto/admin/admin-review-withdraw.dto.js';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guard/roles.guard.js';
import { Roles } from '../../auth/decorator/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('wallet/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  // 1. Admin views all withdrawal requests -> GET /wallet/admin/withdrawals
  @Get('withdrawals')
  async getAllWithdrawals() {
    return this.walletService.getAllWithdrawals();
  }

  // 2. Admin reviews withdrawal request (Approve / Reject) -> PATCH /wallet/admin/withdrawals/:id/review
  @Patch('withdrawals/:id/review')
  async reviewWithdrawal(
    @Param('id') id: string,
    @Body() dto: AdminReviewWithdrawDto,
  ) {
    return this.walletService.reviewWithdrawal(id, dto);
  }
}
