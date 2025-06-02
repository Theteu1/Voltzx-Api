import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true, // Adicione esta linha
    });
  }

  async validate(req: Request, payload: any) {
    console.log('JWT Validation Payload:', payload);
    
    if (!payload.sub || !payload.type) {
      throw new Error('Token inválido - faltam campos essenciais');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      type: payload.type,
      name: payload.name
    };

    // Anexa o usuário à requisição explicitamente
    (req as any).user = user;
    
    return user;
  }
}