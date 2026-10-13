import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class AuthSignupDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@ucp\.edu\.pk$/, { message: 'Only @ucp.edu.pk university email addresses are allowed' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;
}
