# API

Base local: `http://localhost:3333/api`.

- `GET /health`: estado da API
- `GET /api/dashboard/summary`: indicadores do tenant demo
- `GET /api/conversations`: conversas recentes
- `POST /api/agent/respond`: executa o Agent Engine mock
- `GET /api/master/access`: matriz de permissões do administrador Master

Swagger fica em `/docs`. A autenticação atual é deliberadamente simples para o starter; substitua o guard demo por JWT/OIDC antes de uso real.
