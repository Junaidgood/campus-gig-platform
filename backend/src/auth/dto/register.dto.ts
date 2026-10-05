import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Email ka format theek nahi hai' })
  @Matches(/@ucp\.edu\.pk$/, { message: 'Sirf @ucp.edu.pk wali university email allowed hai' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password kam az kam 6 characters ka hona chahiye' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Naam likhna zaroori hai' })
  fullName: string;

  @IsEnum(Role, { message: 'Role sirf STUDENT, TASKER ya ADMIN ho sakta hai' })
  role: Role;
}
