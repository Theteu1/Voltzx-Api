import { Controller, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProposalStatus, UserType } from '@prisma/client';
import { UpdateProposalStatusDto } from './dto/update-status.dto';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.COMPANY)
  create(@Body() dto: CreateProposalDto, @Req() req) {
    return this.proposalsService.create(dto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.OWNER)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProposalStatusDto,
    @Req() req,
  ) {
    return this.proposalsService.updateStatus(id, dto.status, req.user.id);
  }
}