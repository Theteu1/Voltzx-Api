import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [ProposalsController],
  providers: [ProposalsService, PrismaService],
})
export class ProposalsModule {}