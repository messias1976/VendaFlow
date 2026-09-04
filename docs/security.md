# Segurança

- Nunca versionar `.env` ou chaves de provedor.
- Aplicar isolamento por tenant em cada query e testar autorização negativa.
- Validar assinatura dos webhooks WhatsApp e usar idempotência.
- Limitar taxa, tamanho de mensagens e custo de IA.
- Criptografar tokens de integração em repouso.
- Registrar auditoria sem armazenar segredos ou dados desnecessários.
- Adicionar LGPD: consentimento, exportação, exclusão e política de retenção.

## Papéis do Master

- `SUPER_ADMIN`: acesso total, incluindo segurança, cobrança e configurações globais.
- `OPERATIONS_ADMIN`: empresas, agentes, WhatsApp, conversas, CRM, conhecimento e suporte.
- `SUPPORT`: visualização, diagnóstico e atendimento; não altera cobrança ou segurança.
- `FINANCE`: planos, limites, consumo, pagamentos e faturamento; não acessa o conteúdo das conversas.

Toda ação Master deve registrar ator, tenant, ação, horário e metadados mínimos em `AuditEvent`. O usuário do cliente nunca pode consultar eventos ou dados de outro tenant.
