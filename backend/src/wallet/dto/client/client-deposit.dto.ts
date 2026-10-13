import { IsInt, Min } from 'class-validator';

export class ClientDepositDto {
  @IsInt({ message: 'Amount must be a valid integer' })
  @Min(100, { message: 'A minimum deposit of 100 PKR is required' })
  amount: number;
}
