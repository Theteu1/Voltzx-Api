// src/projects/projects.module.ts
import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../shared/prisma.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService], // Adicione PrismaService aqui
  exports: [ProjectsService] // Se você precisar usar este serviço em outros módulos
})
export class ProjectsModule {}