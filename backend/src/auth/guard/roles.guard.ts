import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorator/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Check if the route has any @Roles() requirements
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Agar route par koi tag nahi laga, to sub ko aane do
    }

    // 2. Request se User nikaalo (Jo JwtStrategy ne yahan chipkaya tha)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Login karna zaroori hai');
    }

    // 3. Match the User Role
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Aapko is action ki ijazat nahi hai!');
    }

    return true;
  }
}
