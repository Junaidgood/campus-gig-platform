import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WithdrawalStatus } from '@prisma/client';

export class AdminReviewWithdrawDto {
  @IsEnum(WithdrawalStatus, { message: 'Status must be APPROVED or REJECTED' })
  status: WithdrawalStatus;

  @IsOptional()
  @IsString({ message: 'adminNote must be a string' })
  adminNote?: string;
}
