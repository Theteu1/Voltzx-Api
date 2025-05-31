import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { InvestmentsModule } from './investments/investments.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ProjectsModule } from './projects/projects.module';
import { LandsModule } from './lands/lands.module';
import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, LandsModule, ProjectsModule, ProposalsModule, InvestmentsModule, MonitoringModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
