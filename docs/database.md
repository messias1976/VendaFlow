# Banco de dados

O schema em `packages/db/prisma/schema.prisma` cobre organizações, usuários, agentes, contatos, conversas, mensagens, documentos, planos e eventos de auditoria.

As relações sempre partem de `Tenant`. Em produção, use migrações versionadas, backups, índices revisados e retenção de mensagens configurável por tenant.
