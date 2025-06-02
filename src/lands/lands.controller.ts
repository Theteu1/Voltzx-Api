import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LandsService } from './lands.service';
import { CreateLandDto } from './dto/create-land.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('lands')
@UseGuards(RolesGuard)
@Roles(UserType.OWNER)
export class LandsController {
  constructor(private readonly landsService: LandsService) {}

  
  @Post()
@UseGuards(JwtAuthGuard)
@Roles(UserType.OWNER)
async create(@Body() createLandDto: CreateLandDto, @Req() req) {
  console.log('Creating land for user:', req.user.id);
  return this.landsService.create(createLandDto, req.user.id);
}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.landsService.findAll(req.user);
  }
}