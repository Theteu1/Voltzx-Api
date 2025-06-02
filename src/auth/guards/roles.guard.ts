import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obter roles de forma mais robusta
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não houver roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificação mais segura do usuário e tipo
    if (!user || !user.type) {
      console.error('Usuário ou tipo não encontrado na requisição:', { user, headers: request.headers });
      throw new ForbiddenException('Acesso negado - informações do usuário incompletas');
    }

    // Verifica se o tipo do usuário está nas roles permitidas
    const hasPermission = requiredRoles.some((role) => user.type === role);
    
    if (!hasPermission) {
      throw new ForbiddenException(
        `Acesso negado - Requerido: ${requiredRoles.join(', ')}, Seu tipo: ${user.type}`
      );
    }

    return true;
  }
}