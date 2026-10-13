import { IsEnum, IsNotEmpty } from 'class-validator';
import { GigStatus } from '@prisma/client';

export class AdminUpdateGigStatusDto {
  @IsEnum(GigStatus, { message: 'Status must be PENDING, APPROVED, or REJECTED' })
  @IsNotEmpty({ message: 'Status is required' })
  status: GigStatus;
}
