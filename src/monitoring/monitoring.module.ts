import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService, PrismaService]
})
export class MonitoringModule {}