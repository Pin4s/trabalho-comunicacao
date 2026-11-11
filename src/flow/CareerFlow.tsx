import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type EdgeTypes,
  type FitViewOptions,
  type NodeTypes,
} from '@xyflow/react';
import { initialEdges, initialNodes, type FlowNode, type TrailEdgeType } from './graph';
import { StageCard } from './StageCard';
import { JunctionDot } from './JunctionDot';
import { TrailEdge } from './TrailEdge';
import { useSelection } from '../selection';

const nodeTypes = { stage: StageCard, junction: JunctionDot } satisfies NodeTypes;
const edgeTypes = { trail: TrailEdge } satisfies EdgeTypes;
const fitViewOptions: FitViewOptions = { padding: 0.12, maxZoom: 1.25 };

function Flow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [nodes, , onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const { select } = useSelection();

  // Sem onNodeClick o React Flow desliga pointer-events dos nós não selecionáveis.
  const onNodeClick = useCallback(
    (_event: MouseEvent, node: FlowNode) => {
      if (node.type === 'stage') select(node.data.stageId);
    },
    [select],
  );

  // Refaz o fitView sempre que a área do fluxo muda de tamanho:
  // redimensionar a janela e expandir/compactar o painel lateral.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      void fitView(fitViewOptions);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fitView]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactFlow<FlowNode, TrailEdgeType>
        nodes={nodes}
        edges={initialEdges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}

export function CareerFlow() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
