import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { TaskerAuthController } from './controllers/tasker-auth.controller.js';
import { ClientAuthController } from './controllers/client-auth.controller.js';
import { AdminAuthController } from './controllers/admin-auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      signOptions: { expiresIn: '7d' }, // Token 7 din tak valid rahega
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [
    TaskerAuthController,
    ClientAuthController,
    AdminAuthController,
  ],
  exports: [AuthService],
})
export class AuthModule {}
