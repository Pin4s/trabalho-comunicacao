import { getBezierPath, type EdgeProps } from '@xyflow/react';
import { useReducedMotion } from 'motion/react';
import { BOOT, PACKET } from '../animation';
import type { TrailEdgeType, TrailVariant } from './graph';

const ACCENT = '#22e58b';
/** Tom claro do próprio verde: o pacote precisa se destacar da linha verde por onde passa. */
const PACKET_CORE = '#c8ffe2';
const MASK_MARGIN = 20;

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

const fraction = (seconds: number) => (seconds / PACKET.cycle).toFixed(4);

/**
 * Pacote de dados: ponto verde que percorre o trecho `index` dentro de um ciclo de PACKET.cycle segundos.
 * Os trechos têm janelas consecutivas no ciclo, então o ponto anda Origem → ... → Momento atual.
 */
function DataPacket({ path, index }: { path: string; index: number }) {
  const startSec = PACKET.lead + index * PACKET.segment;
  const keyTimes = `0;${fraction(startSec)};${fraction(startSec + PACKET.segment)};1`;
  const timing = { dur: `${PACKET.cycle}s`, begin: `${PACKET.begin}s`, repeatCount: 'indefinite' };

  return (
    <g opacity={0}>
      <animate attributeName="opacity" values="0;1;0;0" keyTimes={keyTimes} calcMode="discrete" {...timing} />
      <animateMotion path={path} keyPoints="0;0;1;1" keyTimes={keyTimes} calcMode="linear" {...timing} />
      <circle r={7} fill={ACCENT} opacity={0.3} />
      <circle r={3} fill={PACKET_CORE} />
    </g>
  );
}

export function TrailEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<TrailEdgeType>) {
  const reduced = useReducedMotion() ?? false;
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const style = styles[data?.variant ?? 'pending'];
  const bootDelay = data?.bootDelay ?? 0;
  const packetIndex = data?.packetIndex ?? null;
  const glowFilter = style.glow ? { filter: 'drop-shadow(0 0 4px rgba(34, 229, 139, 0.7))' } : undefined;

  // Boot: a linha "se desenha" revelando uma máscara via stroke-dashoffset (funciona também na linha tracejada).
  const maskId = `reveal-${id.replace(/[^\w-]/g, '_')}`;
  const mask = {
    x: Math.min(sourceX, targetX) - MASK_MARGIN,
    y: Math.min(sourceY, targetY) - MASK_MARGIN,
    width: Math.abs(targetX - sourceX) + MASK_MARGIN * 2,
    height: Math.abs(targetY - sourceY) + MASK_MARGIN * 2,
  };

  return (
    <g opacity={style.opacity}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" {...mask}>
          <path
            d={path}
            className="edge-draw"
            fill="none"
            stroke="#fff"
            strokeWidth={16}
            pathLength={1}
            style={{ animationDelay: `${bootDelay}s`, animationDuration: `${BOOT.edgeDuration}s` }}
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`} style={glowFilter}>
        {style.glow && <path d={path} fill="none" stroke={ACCENT} strokeOpacity={0.15} strokeWidth={7} />}
        <path
          d={path}
          fill="none"
          stroke={style.color}
          strokeWidth={1.5}
          strokeDasharray={style.dash}
          strokeLinecap="round"
        />
      </g>

      {data?.sourceDot !== false && (
        <circle
          className="edge-dot"
          cx={sourceX}
          cy={sourceY}
          r={3.5}
          fill={style.color}
          style={{ animationDelay: `${bootDelay}s` }}
        />
      )}
      {data?.targetDot !== false && (
        <circle
          className="edge-dot"
          cx={targetX}
          cy={targetY}
          r={3.5}
          fill={style.color}
          style={{ animationDelay: `${bootDelay + BOOT.edgeDuration}s` }}
        />
      )}

      {packetIndex !== null && !reduced && <DataPacket path={path} index={packetIndex} />}
    </g>
  );
}
