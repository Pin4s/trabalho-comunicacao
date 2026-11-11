import { getBezierPath, type EdgeProps } from '@xyflow/react';
import type { TrailEdgeType, TrailVariant } from './graph';

const ACCENT = '#22e58b';

interface TrailStyle {
  color: string;
  opacity: number;
  dash?: string;
  glow: boolean;
}

const styles: Record<TrailVariant, TrailStyle> = {
  walked: { color: ACCENT, opacity: 1, glow: true },
  pending: { color: '#3a3a3a', opacity: 1, glow: false },
  planned: { color: ACCENT, opacity: 0.9, dash: '6 5', glow: false },
  muted: { color: '#555555', opacity: 0.35, glow: false },
};

export function TrailEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<TrailEdgeType>) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const style = styles[data?.variant ?? 'pending'];
  const glowFilter = style.glow ? { filter: 'drop-shadow(0 0 4px rgba(34, 229, 139, 0.7))' } : undefined;

  return (
    <g opacity={style.opacity} style={glowFilter}>
      {style.glow && <path d={path} fill="none" stroke={ACCENT} strokeOpacity={0.15} strokeWidth={7} />}
      <path
        d={path}
        fill="none"
        stroke={style.color}
        strokeWidth={1.5}
        strokeDasharray={style.dash}
        strokeLinecap="round"
      />
      {data?.sourceDot !== false && <circle cx={sourceX} cy={sourceY} r={3.5} fill={style.color} />}
      {data?.targetDot !== false && <circle cx={targetX} cy={targetY} r={3.5} fill={style.color} />}
    </g>
  );
}
