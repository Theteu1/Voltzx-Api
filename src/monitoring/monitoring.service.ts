import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { UserType } from '@prisma/client';

@Injectable()
export class MonitoringService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string, userType: UserType) {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          { companyId: userId },
          { land: { owner: { userId: userId } } }
        ]
      },
      include: {
        land: {
          include: {
            owner: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        investments: {
          include: {
            investor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return {
      projects,
      user: { id: userId, type: userType }
    };
  }

  async getInvestorDashboard(investorId: string) {
    return this.prisma.investment.findMany({
      where: {
        investorId,
        status: 'ACCEPTED',
        ownerAgree: 'ACCEPTED',
        companyAgree: 'ACCEPTED'
      },
      include: {
        project: {
          include: {
            land: true,
            company: {
              select: {   // aqui troquei o include por select direto
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        investor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  }
}
