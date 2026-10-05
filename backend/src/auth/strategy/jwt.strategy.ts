import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Token kahan se aayega? (Headers mein Bearer Token se)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Expire hone ke baad token ko reject kar do
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  // Agar token bilkul theek hai, to yeh function chalega aur payload ko Request object mein daal dega
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}
