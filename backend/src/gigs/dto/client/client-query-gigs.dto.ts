import { IsOptional, IsString } from 'class-validator';

export class ClientQueryGigsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
