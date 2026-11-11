import { Handle, Position } from '@xyflow/react';
import { JUNCTION_SIZE, hiddenHandle } from './graph';

/** Nó de junção do Y: depois do Pleno, um galho sobe (Gestão) e outro desce (Especialista). */
export function JunctionDot() {
  return (
    <div
      className="grid place-items-center rounded-full border-2 border-accent bg-ink shadow-[0_0_12px_rgba(34,229,139,0.5)]"
      style={{ width: JUNCTION_SIZE, height: JUNCTION_SIZE }}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      <Handle type="target" position={Position.Left} isConnectable={false} style={hiddenHandle} />
      <Handle id="up" type="source" position={Position.Top} isConnectable={false} style={hiddenHandle} />
      <Handle id="down" type="source" position={Position.Bottom} isConnectable={false} style={hiddenHandle} />
    </div>
  );
}
