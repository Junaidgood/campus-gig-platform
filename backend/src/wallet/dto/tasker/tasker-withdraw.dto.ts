import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class TaskerWithdrawDto {
  @IsInt({ message: 'Amount must be a valid integer' })
  @Min(500, { message: 'Minimum withdrawal amount is 500 PKR' })
  amount: number;

  @IsString({ message: 'Payment method must be a string' })
  @IsNotEmpty({ message: 'Payment method is required (e.g. JazzCash, EasyPaisa, Bank)' })
  paymentMethod: string;

  @IsString({ message: 'Account number must be a string' })
  @IsNotEmpty({ message: 'Account number is required' })
  accountNumber: string;

  @IsString({ message: 'Account title must be a string' })
  @IsNotEmpty({ message: 'Account title is required' })
  accountTitle: string;
}
