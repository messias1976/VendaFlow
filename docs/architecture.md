# Arquitetura

O VendaFlow usa um monorepo com separação entre experiência, domínio e infraestrutura. A Web consome a API; a API coordena autenticação, tenants, CRM, conhecimento e mensagens; adaptadores isolam provedores externos.

## Multi-tenant

Cada requisição autenticada resolve `tenantId` no contexto. Todas as entidades de negócio carregam esse identificador e os serviços aplicam o filtro antes de ler ou alterar dados. O próximo passo de endurecimento é habilitar Row Level Security no PostgreSQL/Supabase.

## Fluxo de mensagem

Webhook WhatsApp → normalização → conversa → recuperação de conhecimento → Agent Engine → política de resposta → envio pelo adapter → auditoria.

## Módulos

`auth`, `tenants`, `agents`, `conversations`, `crm`, `knowledge`, `integrations`, `billing` e `health` são limites de domínio independentes. O Agent Engine não conhece detalhes do provedor WhatsApp.

## Operação Master

O painel `/master` é exclusivo da operação do SaaS. A equipe VendaFlow seleciona um tenant, cria ou edita seu agente, define prompt, modelo, número WhatsApp e base de conhecimento. O painel do cliente fica separado em `/` e mostra apenas a operação da própria empresa.
