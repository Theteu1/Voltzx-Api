import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UserType, AgreementStatus, InvestmentStatus } from '@prisma/client';

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  // Criar um investimento usando o investorId da tabela Investor
  async create(dto: CreateInvestmentDto, userId: string) {
    // Busca o investidor pelo userId
    const investor = await this.prisma.investor.findUnique({
      where: { userId },
    });

    if (!investor) {
      throw new ForbiddenException('Usuário não é um investidor válido');
    }

    // Cria o investimento relacionando pelo investorId
    return this.prisma.investment.create({
      data: {
        projectId: dto.projectId,
        value: dto.value,
        description: dto.description,
        investorId: investor.id,
        status: InvestmentStatus.PENDING,
        ownerAgree: AgreementStatus.PENDING,
        companyAgree: AgreementStatus.PENDING,
      },
    });
  }

  // Buscar todos os investimentos de um investidor pelo userId
  async findByInvestor(userId: string) {
    return this.prisma.investment.findMany({
      where: {
        investor: {
          userId: userId,
        },
      },
      include: {
        project: {
          select: {
            title: true,
            description: true,
            status: true,
          },
        },
      },
    });
  }

  // Aprovar ou rejeitar um investimento, validando o investidor e quem pode aprovar
  async approveInvestment(
    investmentId: string,
    userId: string,
    userType: UserType,
    approve: boolean,
  ) {
    // Verifica se o usuário é investidor válido
    const investor = await this.prisma.investor.findUnique({
      where: {
        userId,
      },
    });

    if (!investor) {
      throw new ForbiddenException('Usuário não é um investidor válido');
    }

    // Busca o investimento com relações para validações
    const investment = await this.prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        project: {
          include: {
            company: true,
            land: {
              include: {
                owner: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    if (!investment) {
      throw new NotFoundException('Investimento não encontrado');
    }

    // Verifica se a empresa do projeto pode aprovar (se for empresa)
    if (userType === UserType.COMPANY && investment.project.company.id !== userId) {
      throw new ForbiddenException('Apenas a empresa do projeto pode aprovar');
    }

    // Verifica se o proprietário do terreno pode aprovar (se for owner)
    if (userType === UserType.OWNER && investment.project.land.owner.user.id !== userId) {
      throw new ForbiddenException('Apenas o proprietário do terreno pode aprovar');
    }

    const status = approve ? AgreementStatus.ACCEPTED : AgreementStatus.REJECTED;

    // Define qual campo atualizar de acordo com o tipo de usuário
    const updateData =
      userType === UserType.COMPANY
        ? { companyAgree: status }
        : { ownerAgree: status };

    // Atualiza o investimento com a aprovação/rejeição
    const updatedInvestment = await this.prisma.investment.update({
      where: { id: investmentId },
      data: updateData,
    });

    // Se ambos (empresa e proprietário) aprovaram, atualiza o status geral para ACCEPTED
    if (
      updatedInvestment.companyAgree === AgreementStatus.ACCEPTED &&
      updatedInvestment.ownerAgree === AgreementStatus.ACCEPTED
    ) {
      return this.prisma.investment.update({
        where: { id: investmentId },
        data: { status: InvestmentStatus.ACCEPTED },
        include: { project: true },
      });
    }

    return updatedInvestment;
  }
}
