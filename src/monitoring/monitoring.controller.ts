import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.COMPANY, UserType.OWNER)
  getDashboard(@Req() req) {
    return this.monitoringService.getDashboardData(req.user.id, req.user.type);
  }

  @Get('investor')
  @UseGuards(JwtAuthGuard)
  @Roles(UserType.INVESTOR)
  getInvestorDashboard(@Req() req) {
    return this.monitoringService.getInvestorDashboard(req.user.id);
  }
}