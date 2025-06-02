import { Controller, Get, Patch, UseGuards, Body, Param, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProjectStatus } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types';
import { UpdateProjectStatusDto } from './dto/update-status.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles('COMPANY', 'OWNER')
  async updateProjectStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectStatusDto,
    @Req() req: { user: AuthenticatedUser } // Tipo correto para o user
  ) {
    return this.projectsService.updateStatus(id, updateDto.status, req.user);
  }
}