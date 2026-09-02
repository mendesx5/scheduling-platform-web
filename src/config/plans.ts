import type { Plan } from '../types';

export interface PlanDefinition {
  value: Plan;
  label: string;
  price: number;
  annualPrice: number;
  description: string;
  maxVenues: number;
  maxUsers: number;
  maxAddons: number;
  maxPackages: number;
  highlighted?: boolean;
  features: string[];
  comingSoon?: string[];
}

export const PLANS: PlanDefinition[] = [
  {
    value: 'STARTER',
    label: 'Básico',
    price: 59.9,
    annualPrice: 599,
    description: 'Comece com o essencial e valide sua operação.',
    maxVenues: 1,
    maxUsers: 1,
    maxAddons: 5,
    maxPackages: 2,
    features: ['1 espaço', '1 usuário', 'Página pública', 'Agenda e bloqueios', 'Gestão de reservas', 'Preço fixo por horário', '1 foto na galeria'],
  },
  {
    value: 'PRO',
    label: 'Pro',
    price: 99.9,
    annualPrice: 999,
    description: 'Automatize a operação e passe uma imagem mais profissional.',
    maxVenues: 3,
    maxUsers: 3,
    maxAddons: 15,
    maxPackages: 8,
    highlighted: true,
    features: ['Até 3 espaços','Até 3 usuários','Cobrança por hora, diária e pacote','Sem marca AgendaHub','Funcionários com acesso restrito','Dashboard e gráfico semanal','5 fotos na galeria'],
  },
  {
    value: 'BUSINESS',
    label: 'Plus',
    price: 169.9,
    annualPrice: 1699,
    description: 'Tenha visão completa da operação e suporte prioritário.',
    maxVenues: 5,
    maxUsers: 10,
    maxAddons: 50,
    maxPackages: 20,
    features: ['Até 5 espaços','Até 10 usuários','Tudo do Pro','Galeria ilimitada','Dashboard mensal e comparativos','Ocupação, ticket médio e cancelamentos','Relatórios avançados','Subdomínio personalizado','Suporte prioritário'],
    comingSoon: ['Relatórios avançados', 'Subdomínio personalizado', 'Suporte prioritário'],
  },
];

export const planDefinition = (plan?: Plan) => PLANS.find((item) => item.value === plan) ?? PLANS[0];