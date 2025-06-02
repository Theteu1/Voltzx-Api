import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateLandDto } from './dto/create-land.dto';
import { User } from '@prisma/client';

@Injectable()
export class LandsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLandDto, userId: string) {
    // Primeiro encontre o LandOwner associado ao User
    const landOwner = await this.prisma.landOwner.findUnique({
      where: { userId }
    });

    if (!landOwner) {
      throw new NotFoundException('Perfil de LandOwner não encontrado para este usuário');
    }

    return this.prisma.land.create({
      data: { 
        ...dto, 
        ownerId: landOwner.id, // Use o ID do LandOwner, não do User
        available: dto.available ?? true 
      },
    });
  }

  async findAll(user: User) {
    if (user.type === 'OWNER') {
      const landOwner = await this.prisma.landOwner.findUnique({
        where: { userId: user.id }
      });
      
      if (!landOwner) {
        return [];
      }

      return this.prisma.land.findMany({ 
        where: { ownerId: landOwner.id } 
      });
    } else if (user.type === 'COMPANY') {
      return this.prisma.land.findMany({
        where: { available: true },
        select: { 
          id: true, 
          area: true, 
          city: true, 
          state: true, 
          available: true 
        },
      });
    }
    throw new ForbiddenException('Acesso não autorizado');
  }
}