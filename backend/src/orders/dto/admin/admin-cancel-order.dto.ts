import { IsOptional, IsString } from 'class-validator';

export class AdminCancelOrderDto {
  @IsOptional()
  @IsString({ message: 'Cancellation reason must be a string' })
  reason?: string;
}
