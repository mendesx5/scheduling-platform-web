# Scheduling Platform Web — AgendaHub

Frontend React + TypeScript do SaaS multi-tenant de gestão e reservas de espaços.

## Áreas

- `/` — Landing Page comercial do SaaS
- `/login` — login de usuários de tenant
- `/register` — cadastro com seleção de plano
- `/{slug}` — página pública de reservas
- `/app/*` — painel do assinante
- `/app/onboarding` — configuração inicial
- `/platform/*` — painel do proprietário da plataforma

## Stack

- React
- TypeScript
- Vite
- React Router
- Lucide React
- CSS responsivo sem framework visual pesado

## Rodando localmente

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`:

```env
VITE_API_URL=http://localhost:8080
```

## Compatibilidade com a API

O frontend mantém compatibilidade com os recursos existentes da API e já contém contratos/telas para a próxima evolução do backend:

- `PricingType`: FIXED_SLOT, HOURLY, DAILY, PACKAGE
- pacotes de duração
- adicionais
- políticas de reserva
- cálculo/quote de preço
- limites de plano

As telas que dependem desses endpoints exibem um estado explícito de "API pendente" até a próxima etapa do backend.

## Planos exibidos

A UI usa os nomes comerciais **Básico, Pro e Plus**, mantendo os valores internos atuais `STARTER`, `PRO` e `BUSINESS` para não quebrar a API existente.
