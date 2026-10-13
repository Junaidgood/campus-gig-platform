import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@ucp\.edu\.pk$/, { message: 'Only @ucp.edu.pk university email addresses are allowed' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsEnum(Role, { message: 'Role must be STUDENT, TASKER, or ADMIN' })
  role: Role;
}
