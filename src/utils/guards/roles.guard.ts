import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!requiredRoles) {
            return true // No role restriction
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user // Extracted from the JwtStrategy

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have the required permissions')
        }

        return true
    }
}
