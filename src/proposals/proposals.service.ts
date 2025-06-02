import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProjectStatus, ProposalStatus } from '@prisma/client';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProposalDto, companyId: string) {
    const land = await this.prisma.land.findUnique({ where: { id: dto.landId } });
    if (!land || !land.available) {
      throw new BadRequestException('Terreno não disponível');
    }

    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        powerKw: dto.estimatedEnergyOutput,
        cost: dto.estimatedCost,
        estimatedReturn: dto.estimatedReturn,
        landId: dto.landId,
        companyId,
        status: ProjectStatus.PENDING_APPROVAL,
      },
    });
  }

  async updateStatus(proposalId: string, status: ProposalStatus, ownerId: string) {
  const proposal = await this.prisma.projectProposal.findUnique({
    where: { id: proposalId },
    include: { land: true },
  });

  if (!proposal || proposal.land.ownerId !== ownerId) {
    throw new ForbiddenException('Acesso negado');
  }

  return this.prisma.projectProposal.update({
    where: { id: proposalId },
    data: { status },
  });
}
}