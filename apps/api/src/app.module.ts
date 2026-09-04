import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DashboardController } from './dashboard.controller';
import { AgentController } from './agent.controller';
import { AgentEngine } from './agent.engine';
import { MasterAccessController } from './master-access.controller';

@Module({ controllers: [HealthController, DashboardController, AgentController, MasterAccessController], providers: [AgentEngine] })
export class AppModule {}
