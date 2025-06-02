import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    if (await this.prisma.user.findUnique({ where: { email: data.email } })) {
      throw new ConflictException('Email já está em uso');
    }
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
  return this.prisma.user.findUnique({ 
    where: { email },
    include: {
      landOwner: true,
      company: true,
      investor: true
    }
  });
}


  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        type: true, 
        phone: true 
      }
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        type: true, 
        phone: true 
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    if (data.email && await this.prisma.user.findUnique({ where: { email: data.email as string } })) {
      throw new ConflictException('Email já está em uso');
    }
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string, requesterId: string) {
    const requester = await this.prisma.user.findUnique({ where: { id: requesterId } });
    if (!requester) throw new NotFoundException('Usuário solicitante não encontrado');
    
    if (requester.type !== 'COMPANY' && requester.id !== id) {
      throw new ForbiddenException('Ação não permitida');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        phone: true,
        createdAt: true,
        landOwner: {
          select: {
            id: true
          }
        },
        company: {
          select: {
            id: true,
            name: true
          }
        },
        investor: {
          select: {
            id: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}