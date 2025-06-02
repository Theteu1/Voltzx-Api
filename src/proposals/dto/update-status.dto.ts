import { IsEnum } from 'class-validator';
import { ProposalStatus } from '@prisma/client';

export class UpdateProposalStatusDto {
  @IsEnum(ProposalStatus, { message: 'Status inválido. Use: PENDING, APPROVED ou REJECTED.' })
  status: ProposalStatus;
}
