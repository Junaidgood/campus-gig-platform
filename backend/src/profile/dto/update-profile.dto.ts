import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills?: string[];

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsInt({ message: 'Semester must be an integer' })
  @Min(1, { message: 'Semester must be at least 1' })
  @Max(12, { message: 'Semester cannot exceed 12' })
  semester?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
