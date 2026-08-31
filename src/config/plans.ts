import type { Plan } from '../types';

export interface PlanDefinition {
  value: Plan;
  label: string;
  price: number;
  description: string;
  maxVenues: number;
  maxUsers: number;
  addons: boolean;
  packages: boolean;
  highlighted?: boolean;
  features: string[];
  comingSoon?: string[];
}

export const PLANS: PlanDefinition[] = [
  {
    value: 'STARTER',
    label: 'Básico',
    price: 39.9,
    description: 'Para quem está começando a organizar as reservas.',
    maxVenues: 1,
    maxUsers: 1,
    addons: false,
    packages: false,
    features: ['1 espaço', '1 usuário', 'Página pública', 'Agenda e bloqueios', 'Gestão de reservas'],
  },
  {
    value: 'PRO',
    label: 'Pro',
    price: 69.9,
    description: 'Para operações com mais de um espaço e maior flexibilidade.',
    maxVenues: 3,
    maxUsers: 3,
    addons: true,
    packages: true,
    highlighted: true,
    features: ['Até 3 espaços', 'Até 3 usuários', 'Adicionais', 'Pacotes de duração', 'Personalização avançada'],
  },
  {
    value: 'BUSINESS',
    label: 'Plus',
    price: 99.9,
    description: 'Para negócios com operação maior e mais equipe.',
    maxVenues: 5,
    maxUsers: 10,
    addons: true,
    packages: true,
    features: ['Até 5 espaços', 'Até 10 usuários', 'Todos os recursos Pro'],
    comingSoon: ['Relatórios avançados', 'Subdomínio personalizado', 'Suporte prioritário'],
  },
];

export const planDefinition = (plan?: Plan) => PLANS.find((item) => item.value === plan) ?? PLANS[0];
