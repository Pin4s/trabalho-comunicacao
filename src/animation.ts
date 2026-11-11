import type { Variants } from 'motion/react';

/** Boot ao carregar: cards em sequência, linhas se desenhando, painel por último (total < 1,5s). */
export const BOOT = {
  stagger: 0.08,
  cardDuration: 0.3,
  edgeLead: 0.15,
  edgeDuration: 0.25,
  panelDelay: 1.0,
  panelDuration: 0.3,
};

/** Pacote de dados nas conexões já percorridas: um trecho por vez, ciclo de ~3s. */
export const PACKET = {
  begin: 1.5,
  cycle: 3,
  lead: 0.05,
  segment: 0.35,
};

/** Painel lateral. */
export const PANEL = {
  logMs: 300,
  slide: 12,
  contentIn: 0.2,
  contentOut: 0.12,
  fadeOut: 0.15,
  fadeIn: 0.2,
  stagger: 0.04,
};

/** Troca de conteúdo: `custom` = direção (1 avançando, -1 voltando). */
export const contentVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: PANEL.slide * direction }),
  center: { opacity: 1, x: 0, transition: { duration: PANEL.contentIn, ease: 'easeOut' } },
  exit: (direction: number) => ({
    opacity: 0,
    x: -PANEL.slide * direction,
    transition: { duration: PANEL.contentOut, ease: 'easeIn' },
  }),
};

/** Cascata de marcos e chips (herda os rótulos enter/center do conteúdo). */
export const cascadeListVariants: Variants = {
  center: { transition: { staggerChildren: PANEL.stagger } },
};

export const cascadeItemVariants: Variants = {
  enter: { opacity: 0, y: 4 },
  center: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
};
