// Todos os dados do site. Textos em 1ª pessoa.

export type StageId =
  | 'origem'
  | 'projetos'
  | 'estagio'
  | 'atual'
  | 'diagnostico'
  | 'junior'
  | 'pleno'
  | 'especialista'
  | 'gestao';

export type StageStatus = 'done' | 'current' | 'future' | 'tool' | 'destination' | 'not-chosen';

export type IconName =
  | 'code'
  | 'boxes'
  | 'briefcase'
  | 'laptop'
  | 'bar-chart-3'
  | 'code-xml'
  | 'layers'
  | 'cpu'
  | 'users'
  | 'info';

export interface Quadrant {
  title: string;
  items: string[];
}

export interface PdcaStep {
  letter: 'P' | 'D' | 'C' | 'A';
  label: string;
  text: string;
}

export interface CanvasBlock {
  title: string;
  text: string;
}

export type StageExtra =
  | { kind: 'text'; title: string; text: string }
  | {
      kind: 'diagnostic';
      swot: [Quadrant, Quadrant, Quadrant, Quadrant];
      pdcaNote: string;
      pdca: [PdcaStep, PdcaStep, PdcaStep, PdcaStep];
      canvas: [CanvasBlock, CanvasBlock, CanvasBlock, CanvasBlock];
    };

export interface Stage {
  id: StageId;
  status: StageStatus;
  icon: IconName;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  milestones: string[];
  stack: string[];
  learning?: string;
  extra?: StageExtra;
}

export interface AboutContent {
  icon: IconName;
  label: string;
  title: string;
  description: string;
  stack: string[];
}

export const site = {
  label: 'CAREER ROADMAP',
  title: 'Minha Trajetória Profissional',
  subtitle: 'Uma jornada de evolução contínua, do primeiro código até me tornar especialista em backend.',
  footerPeriod: '2023 → 2031',
  footerModel: 'Modelo: Carreira em Y',
  aboutLink: 'sobre este site',
};

export const statusLabels: Record<StageStatus, string> = {
  done: 'CONCLUÍDO',
  current: 'ATUAL',
  future: 'FUTURO',
  tool: 'FERRAMENTA',
  destination: 'DESTINO',
  'not-chosen': 'CAMINHO NÃO ESCOLHIDO',
};

export const stages: Record<StageId, Stage> = {
  origem: {
    id: 'origem',
    status: 'done',
    icon: 'code',
    period: '2023',
    title: 'Origem',
    subtitle: 'O início de tudo',
    description:
      'Entrei em Sistemas de Informação em 2023. Foi onde tive o primeiro contato com programação, banco de dados e lógica — e onde percebi que o que mais me prende é o que acontece por trás da tela: o backend.',
    milestones: [
      'Início do curso de Sistemas de Informação',
      'Formação Full-Stack da Rocketseat (trilha Explorer)',
      'Primeiro contato com Node.js',
    ],
    stack: ['JavaScript', 'Node.js', 'SQL'],
    learning: 'Aprender sozinho, por curso e por projeto, virou meu jeito padrão de evoluir.',
  },

  projetos: {
    id: 'projetos',
    status: 'done',
    icon: 'boxes',
    period: '2025',
    title: 'Primeiros projetos',
    subtitle: 'Do estudo ao uso real',
    description:
      'Saí dos exercícios e comecei a construir sistemas de verdade: primeiro uma API pessoal pra praticar, depois um sistema freelance usado por pessoas reais.',
    milestones: [
      'API de gerenciamento de tarefas: autenticação JWT, controle de acesso por papel (RBAC), testes com Jest e deploy',
      'Sistema freelance de gestão financeira para eventos: multi-tenant, RBAC, 61 endpoints, com usuários reais',
    ],
    stack: ['TypeScript', 'Node.js', 'Express', 'Fastify', 'Prisma', 'PostgreSQL', 'Jest'],
    learning: 'Lidar com mudança de escopo: a estrutura do sistema freelance mudou três vezes durante o projeto.',
  },

  estagio: {
    id: 'estagio',
    status: 'done',
    icon: 'briefcase',
    period: 'set – nov/2026',
    title: 'Estágio',
    subtitle: 'Primeiro contato com o mercado',
    description:
      'Estágio em desenvolvimento como único dev da empresa. Construí um sistema de automação de prospecção B2B: coleta e enriquecimento de leads e campanhas de mensagens via WhatsApp.',
    milestones: [
      'MVP de automação de prospecção entregue',
      'Backend e frontend próprios do sistema',
      'Primeiro processo seletivo com teste técnico: serviço distribuído em NestJS + filas, entregue em 3 dias',
    ],
    stack: ['Node.js', 'Fastify', 'Prisma', 'PostgreSQL', 'React', 'NestJS'],
    learning:
      'Entendi o que busco no próximo trabalho: um time de devs pra aprender junto e processos de engenharia de verdade.',
  },

  atual: {
    id: 'atual',
    status: 'current',
    icon: 'laptop',
    period: 'nov – dez/2026',
    title: 'Momento atual',
    subtitle: 'Onde estou agora',
    description:
      'Reta final da graduação. Estou finalizando o TCC, me preparando pra formatura e buscando minha primeira vaga como desenvolvedor backend.',
    milestones: [
      'TCC: sistema de automação orientada a eventos, que conecta uma plataforma de e-commerce a ações automáticas (recompensas, metas coletivas e ranking de compradores)',
      'Formatura em dezembro de 2026',
      'Busca por vaga backend júnior remota (Node.js / TypeScript)',
      'Estudando NestJS',
    ],
    stack: ['Node.js', 'TypeScript', 'Fastify', 'PostgreSQL'],
  },

  diagnostico: {
    id: 'diagnostico',
    status: 'tool',
    icon: 'bar-chart-3',
    period: '2026',
    title: 'Diagnóstico',
    subtitle: 'Análise da minha jornada',
    description: 'Antes de seguir, parei pra olhar onde estou e como vou evoluir.',
    milestones: [],
    stack: [],
    extra: {
      kind: 'diagnostic',
      swot: [
        {
          title: 'Forças',
          items: [
            'Projetos reais, com usuários',
            'Backend com Node.js e TypeScript (APIs, RBAC, multi-tenant)',
            'Autonomia pra aprender e entregar sozinho',
            'Uso de IA como ferramenta de produtividade',
          ],
        },
        {
          title: 'Fraquezas',
          items: [
            'Pouca experiência formal',
            'Nunca trabalhei em um time de devs',
            'Frontend e CSS são meu ponto fraco',
            'Testes automatizados ainda não são hábito',
          ],
        },
        {
          title: 'Oportunidades',
          items: [
            'Vagas remotas',
            'NestJS em alta nas vagas de Node.js',
            'Open source como vitrine',
            'IA acelera quem domina os fundamentos',
          ],
        },
        {
          title: 'Ameaças',
          items: [
            'Mercado júnior muito concorrido',
            'Exigência de experiência até pra vaga júnior',
            'Poucas vagas de dev na minha cidade',
            'Tecnologias mudando rápido',
          ],
        },
      ],
      pdcaNote: 'Aplicado à próxima fase',
      pdca: [
        { letter: 'P', label: 'Planejar', text: 'Meta: primeira vaga backend júnior remota até meados de 2027.' },
        {
          letter: 'D',
          label: 'Executar',
          text: 'Finalizar o TCC e publicar no portfólio, estudar NestJS, enviar candidaturas toda semana e contribuir com open source.',
        },
        {
          letter: 'C',
          label: 'Verificar',
          text: 'Todo mês: quantas candidaturas, quantas entrevistas, que retorno recebi.',
        },
        {
          letter: 'A',
          label: 'Agir',
          text: 'Ajustar currículo, portfólio e estudos com base no que as vagas pedem e no feedback dos processos.',
        },
      ],
      canvas: [
        { title: 'Quem sou', text: 'Desenvolvedor backend recém-formado em Sistemas de Informação.' },
        {
          title: 'O que ofereço',
          text: 'APIs e sistemas backend em Node.js/TypeScript, com autonomia e foco em resolver o problema.',
        },
        { title: 'Pra quem', text: 'Empresas de software e times de produto que trabalham remoto.' },
        { title: 'Como chego até eles', text: 'Portfólio no GitHub, projetos reais, open source e candidaturas.' },
      ],
    },
  },

  junior: {
    id: 'junior',
    status: 'future',
    icon: 'code-xml',
    period: '2027 – 2028',
    title: 'Júnior',
    subtitle: 'Primeira vaga',
    description:
      'Primeira vaga como desenvolvedor backend. Aqui começa o tronco do Y: base técnica comum, antes de qualquer escolha de caminho.',
    milestones: [
      'Trabalhar em time: code review, versionamento e processos',
      'Dominar NestJS, testes automatizados e Docker',
      'Entregar funcionalidades em produção com consistência',
    ],
    stack: ['NestJS', 'Docker', 'Testes'],
  },

  pleno: {
    id: 'pleno',
    status: 'future',
    icon: 'layers',
    period: '2029 – 2030',
    title: 'Pleno',
    subtitle: 'Ponto de decisão do Y',
    description:
      'Com autonomia técnica, passo a desenhar soluções e ajudar quem está chegando. É aqui que a carreira em Y bifurca.',
    milestones: [
      'Desenhar soluções, não só implementar',
      'Apoiar e orientar devs júnior',
      'Escolher o caminho do Y',
    ],
    stack: [],
    extra: {
      kind: 'text',
      title: 'O que é a carreira em Y',
      text: 'Todo mundo sobe pelo mesmo tronco técnico (júnior → pleno). A partir daí, existem dois caminhos com o mesmo peso de crescimento: o técnico (especialista) e o de gestão (liderança de pessoas).',
    },
  },

  especialista: {
    id: 'especialista',
    status: 'destination',
    icon: 'cpu',
    period: '2031',
    title: 'Especialista',
    subtitle: 'Aprofundar o técnico',
    description: 'Meu destino no Y: desenvolvedor sênior e referência técnica em backend.',
    milestones: [
      'Arquitetura de sistemas e sistemas distribuídos',
      'Performance e escalabilidade',
      'Referência técnica do time',
    ],
    stack: ['Arquitetura', 'Sistemas distribuídos', 'Mensageria', 'Cloud'],
    extra: {
      kind: 'text',
      title: 'Por que esse caminho',
      text: 'O que mais me motiva é construir e desenhar sistemas. Quero crescer aprofundando isso, não me afastando.',
    },
  },

  gestao: {
    id: 'gestao',
    status: 'not-chosen',
    icon: 'users',
    period: '—',
    title: 'Gestão',
    subtitle: 'Liderança e estratégia',
    description: 'Tech lead e gerente de engenharia: foco em pessoas, processos e prazos.',
    milestones: [],
    stack: [],
    extra: {
      kind: 'text',
      title: 'Por que não',
      text: 'É um caminho válido, mas me afasta do que mais gosto de fazer: construir sistemas.',
    },
  },
};

export const about: AboutContent = {
  icon: 'info',
  label: 'SOBRE',
  title: 'Sobre este site',
  description:
    'Este site é parte do meu planejamento de carreira. Foi construído com React, TypeScript e React Flow, gerado com apoio de IA (Claude Code) e publicado na Vercel.',
  stack: ['React', 'TypeScript', 'Tailwind', 'React Flow', 'Claude Code', 'Vercel'],
};

/** Ordem principal (setas ← → do teclado e botões anterior/próxima). A Gestão fica fora. */
export const mainOrder: StageId[] = [
  'origem',
  'projetos',
  'estagio',
  'atual',
  'diagnostico',
  'junior',
  'pleno',
  'especialista',
];

export interface Neighbors {
  prev: StageId | null;
  next: StageId | null;
}

export function getNeighbors(id: StageId): Neighbors {
  if (id === 'gestao') return { prev: 'pleno', next: 'especialista' };
  const index = mainOrder.indexOf(id);
  return {
    prev: index > 0 ? mainOrder[index - 1] : null,
    next: index >= 0 && index < mainOrder.length - 1 ? mainOrder[index + 1] : null,
  };
}
