import type { CSSProperties } from 'react';
import type { Edge, Node } from '@xyflow/react';
import type { StageId } from '../data/career';
import { BOOT } from '../animation';

export const CARD_WIDTH = 176;
export const CARD_HEIGHT = 160;
export const JUNCTION_SIZE = 16;

/** Handles existem só para ancorar as linhas; ficam invisíveis. */
export const hiddenHandle: CSSProperties = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: 0,
  pointerEvents: 'none',
};

const STEP_X = CARD_WIDTH + 44;
const BRANCH_OFFSET_Y = 150;

/** bootIndex: ordem de entrada no boot (esquerda → direita). */
export type StageNodeType = Node<{ stageId: StageId; bootIndex: number }, 'stage'>;
export type JunctionNodeType = Node<{ bootIndex: number }, 'junction'>;
export type FlowNode = StageNodeType | JunctionNodeType;

/**
 * walked  → caminho já percorrido (verde com glow)
 * pending → do momento atual em diante (cinza)
 * planned → galho escolhido do Y (verde tracejado)
 * muted   → galho não escolhido (cinza, opacidade baixa)
 */
export type TrailVariant = 'walked' | 'pending' | 'planned' | 'muted';

/**
 * bootDelay:   quando a linha começa a se desenhar no boot (s)
 * packetIndex: posição do trecho na sequência do pacote de dados (só nas linhas percorridas)
 */
export type TrailEdgeType = Edge<
  { variant: TrailVariant; sourceDot: boolean; targetDot: boolean; bootDelay: number; packetIndex: number | null },
  'trail'
>;

const trunk: StageId[] = ['origem', 'projetos', 'estagio', 'atual', 'diagnostico', 'junior', 'pleno'];
const JUNCTION_BOOT = trunk.length;
const BRANCH_BOOT = trunk.length + 1;

function stageNode(stageId: StageId, x: number, y: number, bootIndex: number): StageNodeType {
  return { id: stageId, type: 'stage', position: { x, y }, data: { stageId, bootIndex } };
}

const plenoRight = (trunk.length - 1) * STEP_X + CARD_WIDTH;
const junctionX = plenoRight + 36;
const branchX = junctionX + JUNCTION_SIZE + 56;
const centerY = CARD_HEIGHT / 2;

const junction: JunctionNodeType = {
  id: 'juncao',
  type: 'junction',
  position: { x: junctionX, y: centerY - JUNCTION_SIZE / 2 },
  data: { bootIndex: JUNCTION_BOOT },
};

export const initialNodes: FlowNode[] = [
  ...trunk.map((id, index) => stageNode(id, index * STEP_X, 0, index)),
  junction,
  stageNode('gestao', branchX, -BRANCH_OFFSET_Y, BRANCH_BOOT),
  stageNode('especialista', branchX, BRANCH_OFFSET_Y, BRANCH_BOOT),
];

interface TrailOptions {
  /** Índice de boot do nó de origem: a linha se desenha logo depois que ele aparece. */
  bootIndex: number;
  packetIndex?: number;
  sourceHandle?: string;
  sourceDot?: boolean;
  targetDot?: boolean;
}

function trail(source: string, target: string, variant: TrailVariant, options: TrailOptions): TrailEdgeType {
  return {
    id: `${source}->${target}`,
    source,
    target,
    sourceHandle: options.sourceHandle,
    type: 'trail',
    data: {
      variant,
      sourceDot: options.sourceDot ?? true,
      targetDot: options.targetDot ?? true,
      bootDelay: options.bootIndex * BOOT.stagger + BOOT.edgeLead,
      packetIndex: options.packetIndex ?? null,
    },
  };
}

export const initialEdges: TrailEdgeType[] = [
  trail('origem', 'projetos', 'walked', { bootIndex: 0, packetIndex: 0 }),
  trail('projetos', 'estagio', 'walked', { bootIndex: 1, packetIndex: 1 }),
  trail('estagio', 'atual', 'walked', { bootIndex: 2, packetIndex: 2 }),
  trail('atual', 'diagnostico', 'pending', { bootIndex: 3 }),
  trail('diagnostico', 'junior', 'pending', { bootIndex: 4 }),
  trail('junior', 'pleno', 'pending', { bootIndex: 5 }),
  trail('pleno', 'juncao', 'pending', { bootIndex: 6, targetDot: false }),
  trail('juncao', 'gestao', 'muted', { bootIndex: JUNCTION_BOOT, sourceHandle: 'up', sourceDot: false }),
  trail('juncao', 'especialista', 'planned', { bootIndex: JUNCTION_BOOT, sourceHandle: 'down', sourceDot: false }),
];
