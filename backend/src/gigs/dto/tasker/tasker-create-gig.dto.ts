import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class TaskerCreateGigDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsInt({ message: 'Price must be a valid integer' })
  @Min(100, { message: 'Price must be at least 100 PKR' })
  price: number;

  @IsInt({ message: 'Delivery time must be a valid integer' })
  @Min(1, { message: 'Delivery time must be at least 1 day' })
  deliveryTime: number;
}
