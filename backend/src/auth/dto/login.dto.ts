import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email ka format theek nahi hai' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password likhna zaroori hai' })
  password: string;
}
