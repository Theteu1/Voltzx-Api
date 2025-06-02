import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.INVESTOR)
  create(@Body() dto: CreateInvestmentDto, @Req() req) {
    return this.investmentsService.create(dto, req.user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.INVESTOR)
  findMyInvestments(@Req() req) {
    return this.investmentsService.findByInvestor(req.user.id);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.COMPANY, UserType.OWNER)
  approve(
    @Param('id') id: string,
    @Body() { approve }: { approve: boolean },
    @Req() req
  ) {
    return this.investmentsService.approveInvestment(
      id,
      req.user.id,
      req.user.type,
      approve
    );
  }
}