import { IsString, IsNotEmpty } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectStatusDto {
  @IsString()
  @IsNotEmpty()
  status: ProjectStatus;
}