# Scheduling Platform Web

Frontend React + TypeScript para o backend `mendesx5/scheduling-platform`.

## Áreas

- Página pública por `/{slug}` (também aceita `/p/{slug}`)
- Cadastro e login de tenant
- Dashboard do estabelecimento
- Reservas e pagamentos manuais
- Espaços, disponibilidade e períodos bloqueados
- Clientes e equipe com roles
- Assinatura e personalização pública
- Login e dashboard global do PLATFORM_ADMIN

## Rodar

```bash
cp .env.example .env
npm install
npm run dev
```

Configure `VITE_API_URL` apontando para a API Spring Boot.

## Rotas principais

- `/login`
- `/register`
- `/{slug}`
- `/app`
- `/app/bookings`
- `/app/venues`
- `/app/venues/:id`
- `/app/customers`
- `/app/team`
- `/app/subscription`
- `/app/settings`
- `/platform/login`
- `/platform`
- `/platform/tenants`
