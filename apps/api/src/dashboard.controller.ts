import { Controller, Get } from '@nestjs/common';
@Controller('dashboard')
export class DashboardController {
  @Get('summary') summary() { return { activeConversations: 38, newLeads: 124, responseRate: 94, revenue: 28750, tenantId: 'demo-tenant' }; }
}
