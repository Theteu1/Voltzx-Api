import { Module } from '@nestjs/common';
import { LandsController } from './lands.controller';
import { LandsService } from './lands.service';
import { PrismaService } from './../shared/prisma.service';

@Module({
  controllers: [LandsController],
  providers: [LandsService, PrismaService],
})
export class LandsModule {}