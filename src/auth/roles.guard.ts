import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      (Reflect.getMetadata(ROLES_KEY, context.getHandler()) as string[]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Token inválido o faltante');
    }

    const userRoles: string[] = user.roles ?? [];
    const hasRole = requiredRoles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      throw new ForbiddenException('No autorizado');
    }

    return true;
  }
}
