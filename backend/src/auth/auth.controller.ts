import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guard/jwt-auth.guard.js';
import { RolesGuard } from './guard/roles.guard.js';
import { Roles } from './decorator/roles.decorator.js';
import { Role } from '@prisma/client';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }


  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // --- EXAMPLE: Sirf TASKER (Seller) apna profile dekh sakta hai ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TASKER)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: 'Welcome Tasker!',
      user: req.user, // Yeh woh data hai jo Strategy ne nikal kar yahan rakha tha
    };
  }
}



