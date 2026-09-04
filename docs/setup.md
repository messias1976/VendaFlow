# Setup local

1. Instale Node.js 20+ e Docker Desktop.
2. Copie `.env.example` para `.env`.
3. Suba PostgreSQL e Redis com `docker compose up -d postgres redis`.
4. Rode `npm install`, `npm run db:generate` e `npm run db:push`.
5. Inicie com `npm run dev`.

O seed visual usa dados mock no painel. Para conectar serviços reais, implemente um adapter em `apps/api/src/integrations` e preencha as variáveis de ambiente.
