import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import { AuthSignupDto } from '../dto/auth-signup.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { Role } from '@prisma/client';

@Controller('auth/client')
export class ClientAuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/client/signup
  @Post('signup')
  async signup(@Body() dto: AuthSignupDto) {
    return this.authService.signupWithRole(dto, Role.CLIENT);
  }

  // POST /auth/client/login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto, Role.CLIENT);
  }
}
