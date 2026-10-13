import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class ClientCreateReviewDto {
  @IsString({ message: 'orderId must be a string' })
  @IsNotEmpty({ message: 'orderId is required' })
  orderId: string;

  @IsInt({ message: 'Rating must be a number between 1 and 5' })
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  rating: number;

  @IsString({ message: 'Comment must be a text string' })
  @IsNotEmpty({ message: 'Review comment is required' })
  comment: string;
}
