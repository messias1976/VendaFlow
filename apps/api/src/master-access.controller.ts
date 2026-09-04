import { Controller, Get } from '@nestjs/common';

@Controller('master/access')
export class MasterAccessController {
  @Get()
  permissions() {
    return {
      roles: {
        SUPER_ADMIN: 'Acesso total à plataforma',
        OPERATIONS_ADMIN: 'Operação de clientes, agentes e suporte',
        SUPPORT: 'Visualização, diagnóstico e atendimento',
        FINANCE: 'Planos, consumo e faturamento',
      },
      audit: { enabled: true, event: 'actor, tenant, action, timestamp and metadata' },
    };
  }
}
