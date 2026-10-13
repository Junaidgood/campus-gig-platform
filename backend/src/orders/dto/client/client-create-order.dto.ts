import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientCreateOrderDto {
  @IsString({ message: 'gigId must be a valid string' })
  @IsNotEmpty({ message: 'gigId is required' })
  gigId: string;

  @IsOptional()
  @IsString({ message: 'requirements must be a string' })
  requirements?: string;
}
