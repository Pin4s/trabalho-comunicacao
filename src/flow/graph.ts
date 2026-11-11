import type { CSSProperties } from 'react';
import type { Edge, Node } from '@xyflow/react';
import type { StageId } from '../data/career';

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

export type StageNodeType = Node<{ stageId: StageId }, 'stage'>;
export type JunctionNodeType = Node<Record<string, never>, 'junction'>;
export type FlowNode = StageNodeType | JunctionNodeType;

/**
 * walked  → caminho já percorrido (verde com glow)
 * pending → do momento atual em diante (cinza)
 * planned → galho escolhido do Y (verde tracejado)
 * muted   → galho não escolhido (cinza, opacidade baixa)
 */
export type TrailVariant = 'walked' | 'pending' | 'planned' | 'muted';

export type TrailEdgeType = Edge<
  { variant: TrailVariant; sourceDot: boolean; targetDot: boolean },
  'trail'
>;

const trunk: StageId[] = ['origem', 'projetos', 'estagio', 'atual', 'diagnostico', 'junior', 'pleno'];

function stageNode(stageId: StageId, x: number, y: number): StageNodeType {
  return { id: stageId, type: 'stage', position: { x, y }, data: { stageId } };
}

const plenoRight = (trunk.length - 1) * STEP_X + CARD_WIDTH;
const junctionX = plenoRight + 36;
const branchX = junctionX + JUNCTION_SIZE + 56;
const centerY = CARD_HEIGHT / 2;

const junction: JunctionNodeType = {
  id: 'juncao',
  type: 'junction',
  position: { x: junctionX, y: centerY - JUNCTION_SIZE / 2 },
  data: {},
};

export const initialNodes: FlowNode[] = [
  ...trunk.map((id, index) => stageNode(id, index * STEP_X, 0)),
  junction,
  stageNode('gestao', branchX, -BRANCH_OFFSET_Y),
  stageNode('especialista', branchX, BRANCH_OFFSET_Y),
];

interface TrailOptions {
  sourceHandle?: string;
  sourceDot?: boolean;
  targetDot?: boolean;
}

function trail(source: string, target: string, variant: TrailVariant, options: TrailOptions = {}): TrailEdgeType {
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
    },
  };
}

export const initialEdges: TrailEdgeType[] = [
  trail('origem', 'projetos', 'walked'),
  trail('projetos', 'estagio', 'walked'),
  trail('estagio', 'atual', 'walked'),
  trail('atual', 'diagnostico', 'pending'),
  trail('diagnostico', 'junior', 'pending'),
  trail('junior', 'pleno', 'pending'),
  trail('pleno', 'juncao', 'pending', { targetDot: false }),
  trail('juncao', 'gestao', 'muted', { sourceHandle: 'up', sourceDot: false }),
  trail('juncao', 'especialista', 'planned', { sourceHandle: 'down', sourceDot: false }),
];
