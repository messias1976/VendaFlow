# VendaFlow AI

Plataforma SaaS multi-tenant para agentes de vendas e atendimento via WhatsApp. Este repositório é um starter profissional, modular e pronto para abrir no Cursor.

## Stack

- Web: Next.js, TypeScript, Tailwind CSS
- API: NestJS, TypeScript, Swagger
- Dados: PostgreSQL com Prisma
- Filas/cache: Redis
- Infra: Docker Compose
- Integrações desacopladas: WhatsApp e IA

## Início rápido

```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run db:generate
npm run db:push
npm run dev
```

Abra `http://localhost:3000` e a documentação da API em `http://localhost:3333/docs`.

## Estrutura

```text
apps/web       painel master e painel do cliente
apps/api       API modular e Agent Engine
packages/db    schema Prisma e cliente de banco
packages/config configurações compartilhadas
docs           decisões, segurança, API, banco e roadmap
```

Os adaptadores mock de IA e WhatsApp permitem desenvolvimento local sem credenciais externas.
