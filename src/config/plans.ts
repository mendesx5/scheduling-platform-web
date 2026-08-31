import type { Plan } from '../types';

export interface PlanDefinition {
  value: Plan;
  label: string;
  price: number;
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
    description: 'Para quem está começando a organizar as reservas.',
    maxVenues: 1,
    maxUsers: 1,
    maxAddons: 5,
    maxPackages: 2,
    features: ['1 espaço', '1 usuário', 'Página pública', 'Agenda e bloqueios', 'Gestão de reservas', 'Até 5 adicionais por espaço', 'Até 2 pacotes por espaço'],
  },
  {
    value: 'PRO',
    label: 'Pro',
    price: 99.9,
    description: 'Para operações com mais de um espaço e maior flexibilidade.',
    maxVenues: 3,
    maxUsers: 3,
    maxAddons: 15,
    maxPackages: 8,
    highlighted: true,
    features: ['Até 3 espaços', 'Até 3 usuários', 'Até 15 adicionais por espaço', 'Até 8 pacotes por espaço', 'Personalização avançada'],
  },
  {
    value: 'BUSINESS',
    label: 'Plus',
    price: 169.9,
    description: 'Para negócios com operação maior e mais equipe.',
    maxVenues: 5,
    maxUsers: 10,
    maxAddons: 50,
    maxPackages: 20,
    features: ['Até 5 espaços', 'Até 10 usuários', 'Até 50 adicionais por espaço', 'Até 20 pacotes por espaço', 'Todos os recursos Pro'],
    comingSoon: ['Relatórios avançados', 'Subdomínio personalizado', 'Suporte prioritário'],
  },
];

export const planDefinition = (plan?: Plan) => PLANS.find((item) => item.value === plan) ?? PLANS[0];