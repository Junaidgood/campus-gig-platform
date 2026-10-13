import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'recipientId must be a string' })
  @IsNotEmpty({ message: 'recipientId is required' })
  recipientId: string;

  @IsString({ message: 'Message text must be a string' })
  @IsNotEmpty({ message: 'Message cannot be empty' })
  text: string;

  @IsOptional()
  @IsString()
  gigId?: string;

  @IsOptional()
  @IsString()
  orderId?: string;
}
