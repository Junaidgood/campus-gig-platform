import { IsNotEmpty, IsString } from 'class-validator';

export class TaskerDeliverOrderDto {
  @IsString({ message: 'deliveryNote must be text or a URL link' })
  @IsNotEmpty({ message: 'Submission details or delivery link is required' })
  deliveryNote: string;
}
