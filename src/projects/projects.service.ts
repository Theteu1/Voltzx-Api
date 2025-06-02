import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { ProjectStatus } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types'; // Importe o novo tipo

@Injectable()
export class ProjectsService {
  findActive() {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async updateStatus(
    projectId: string,
    newStatus: ProjectStatus,
    user: AuthenticatedUser
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        land: {
          include: {
            owner: {
              include: {
                user: true
              }
            }
          }
        },
        company: true
      }
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Verificação de permissões
    const isCompanyOwner = user.type === 'COMPANY' && 
                         project.company.id === user.id;
    
    const isLandOwner = user.type === 'OWNER' && 
                      project.land.owner.user.id === user.id;

    if (!isCompanyOwner && !isLandOwner) {
      throw new ForbiddenException('Ação não permitida');
    }

    // Defina o tipo corretamente para validTransitions
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      PENDING_APPROVAL: [ProjectStatus.ACTIVE, ProjectStatus.REJECTED],
      ACTIVE: [ProjectStatus.COMPLETED],
      REJECTED: [],
      COMPLETED: []
    };

    // Verifique se newStatus é uma transição válida
    if (!validTransitions[project.status]?.includes(newStatus)) {
      throw new ConflictException(
        `Transição de status inválida: ${project.status} → ${newStatus}`
      );
    }

    // Atualização atômica
    return this.prisma.$transaction(async (tx) => {
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: { status: newStatus }
      });

      if (newStatus === ProjectStatus.ACTIVE) {
        await tx.land.update({
          where: { id: project.landId },
          data: { available: false }
        });
      }

      return updatedProject;
    });
  }
}