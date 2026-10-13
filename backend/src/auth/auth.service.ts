import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthSignupDto } from './dto/auth-signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Role-based signup (Tasker, Client, Admin)
  async signupWithRole(dto: AuthSignupDto, role: Role) {
    // 1. Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists!');
    }

    // 2. Hash the password securely
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Save new user to database with specific role
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: role,
      },
    });

    // 4. Return success (without password!)
    return {
      message: `${role} account created successfully!`,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName,
      },
    };
  }

  // Login with optional role verification to prevent unauthorized role access
  async login(dto: LoginDto, expectedRole?: Role) {
    // 1. Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Match the password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Verify user role if an expected role is specified
    if (expectedRole && user.role !== expectedRole) {
      throw new UnauthorizedException(
        `Your account role is ${user.role}. This endpoint is restricted to ${expectedRole}.`,
      );
    }

    // 4. Generate JWT Token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: `${user.role} login successful!`,
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    };
  }
}
