import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Check, Star } from 'lucide-react';
import { m } from 'motion/react';
import { BOOT } from '../animation';
import { stages, type StageStatus } from '../data/career';
import { icons } from '../components/icons';
import { useSelection } from '../selection';
import { CARD_HEIGHT, CARD_WIDTH, hiddenHandle, type StageNodeType } from './graph';

function borderClass(status: StageStatus, selected: boolean): string {
  if (status === 'destination') return 'border-2 border-accent';
  if (status === 'tool') return selected ? 'border border-dashed border-accent' : 'border border-dashed border-[#3a3a3a]';
  return selected ? 'border border-accent' : 'border border-line hover:border-[#333]';
}

function StatusMarker({ status }: { status: StageStatus }) {
  switch (status) {
    case 'done':
      return (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-black">
          <Check size={12} strokeWidth={3} />
        </span>
      );
    case 'current':
      return <span className="block h-5 w-5 rounded-full border-2 border-accent shadow-[0_0_10px_rgba(34,229,139,0.55)]" />;
    case 'destination':
      return <Star size={18} strokeWidth={1.5} className="fill-accent text-accent" />;
    case 'future':
    case 'not-chosen':
      return <span className="block h-5 w-5 rounded-full border border-[#444]" />;
    case 'tool':
      return null;
  }
}

export function StageCard({ data }: NodeProps<StageNodeType>) {
  const stage = stages[data.stageId];
  const { selectedId } = useSelection();
  const selected = selectedId === stage.id;
  const Icon = icons[stage.icon];
  const dim = stage.status === 'future' || stage.status === 'not-chosen';

  return (
    <div className="relative" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      {/* Boot: fade + scale. Handles ficam fora do elemento escalado pra medição do React Flow não distorcer. */}
      <m.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: data.bootIndex * BOOT.stagger, duration: BOOT.cardDuration, ease: 'easeOut' }}
      >
        {stage.status === 'current' && (
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold text-black">
            Atual
          </span>
        )}

        <button
          type="button"
          aria-pressed={selected}
          aria-label={`${stage.title}: ${stage.subtitle}`}
          className={[
            'flex h-full w-full cursor-pointer flex-col items-center rounded-xl bg-surface px-3 pb-4 pt-4 text-center outline-none',
            'focus-visible:ring-1 focus-visible:ring-accent',
            borderClass(stage.status, selected),
            selected ? 'shadow-[0_0_26px_-4px_rgba(34,229,139,0.45)]' : '',
            stage.status === 'not-chosen' ? 'opacity-40' : '',
          ].join(' ')}
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-lg border border-line bg-black/40 ${
              dim && !selected ? 'text-neutral-500' : 'text-accent'
            }`}
          >
            <Icon size={18} strokeWidth={1.5} />
          </span>
          <span className={`mt-3 font-mono text-[13px] font-semibold leading-tight ${dim ? 'text-neutral-300' : 'text-white'}`}>
            {stage.title}
          </span>
          <span className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-neutral-400">{stage.subtitle}</span>
          <span className="mt-auto flex h-5 items-center">
            <StatusMarker status={stage.status} />
          </span>
        </button>
      </m.div>

      <Handle type="target" position={Position.Left} isConnectable={false} style={hiddenHandle} />
      <Handle type="source" position={Position.Right} isConnectable={false} style={hiddenHandle} />
    </div>
  );
}
