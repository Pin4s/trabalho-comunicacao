import { Handle, Position, type NodeProps } from '@xyflow/react';
import { m } from 'motion/react';
import { BOOT } from '../animation';
import { JUNCTION_SIZE, hiddenHandle, type JunctionNodeType } from './graph';

/** Nó de junção do Y: depois do Pleno, um galho sobe (Gestão) e outro desce (Especialista). */
export function JunctionDot({ data }: NodeProps<JunctionNodeType>) {
  return (
    <div className="relative" style={{ width: JUNCTION_SIZE, height: JUNCTION_SIZE }}>
      <m.div
        className="grid h-full w-full place-items-center rounded-full border-2 border-accent bg-ink shadow-[0_0_12px_rgba(34,229,139,0.5)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: data.bootIndex * BOOT.stagger, duration: BOOT.cardDuration, ease: 'easeOut' }}
      >
        <span className="h-1 w-1 rounded-full bg-accent" />
      </m.div>
      <Handle type="target" position={Position.Left} isConnectable={false} style={hiddenHandle} />
      <Handle id="up" type="source" position={Position.Top} isConnectable={false} style={hiddenHandle} />
      <Handle id="down" type="source" position={Position.Bottom} isConnectable={false} style={hiddenHandle} />
    </div>
  );
}
