import { useEffect, useRef, useState, type ReactNode, type TransitionEvent } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import {
  about,
  getNeighbors,
  mainOrder,
  stages,
  statusLabels,
  type Stage,
  type StageId,
} from '../data/career';
import type { Selection } from '../selection';
import type { PanelPhase } from '../usePanelPhase';
import { BOOT, PANEL, cascadeItemVariants, cascadeListVariants, contentVariants } from '../animation';
import { icons } from './icons';
import { DiagnosticTabs } from './DiagnosticTabs';

interface SidePanelProps {
  selection: Selection;
  phase: PanelPhase;
  onToggle: () => void;
  onContentHidden: () => void;
  onWidthSettled: () => void;
  onSelect: (id: StageId) => void;
  onBack: () => void;
}

interface RequestLog {
  id: StageId;
  ms: number;
}

const iconButton =
  'grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line text-neutral-400 hover:border-accent hover:text-accent';

const navButton =
  'flex-1 rounded-md border border-line px-3 py-2.5 font-mono text-xs text-neutral-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30';

function selectionKey(selection: Selection): string {
  return selection.kind === 'stage' ? selection.id : 'about';
}

/** Posição na ordem principal, pra saber se a navegação avança ou volta. */
function orderPosition(selection: Selection): number {
  if (selection.kind === 'about') return mainOrder.length;
  if (selection.id === 'gestao') return mainOrder.indexOf('pleno') + 0.5;
  return mainOrder.indexOf(selection.id);
}

function statusLine(selection: Selection): string {
  if (selection.kind === 'about') return about.label;
  const stage = stages[selection.id];
  const period = stage.period === '—' ? '' : ` · ${stage.period}`;
  return `${statusLabels[stage.status]}${period}`;
}

function logLine(log: RequestLog): string {
  const status = log.id === 'gestao' ? '204 No Content' : '200 OK';
  return `GET /etapas/${log.id} → ${status} · ${log.ms}ms`;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <m.ul variants={cascadeListVariants} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <m.li
          key={item}
          variants={cascadeItemVariants}
          className="rounded border border-[#2a2a2a] px-2 py-0.5 font-mono text-[11px] text-neutral-300"
        >
          {item}
        </m.li>
      ))}
    </m.ul>
  );
}

function PanelHeading({ title, iconName }: { title: string; iconName: Stage['icon'] }) {
  const Icon = icons[iconName];
  return (
    <h2 className="flex items-center gap-3 font-mono text-2xl font-semibold leading-tight text-white">
      <Icon size={20} strokeWidth={1.5} className="shrink-0 text-accent" />
      {title}
    </h2>
  );
}

function StageBody({ stage }: { stage: Stage }) {
  const { extra } = stage;
  return (
    <>
      <PanelHeading title={stage.title} iconName={stage.icon} />
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">{stage.description}</p>
      <hr className="my-6 border-line" />
      <div className="space-y-7">
        {stage.milestones.length > 0 && (
          <Section title="Marcos">
            <m.ul
              variants={cascadeListVariants}
              className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-neutral-300 marker:text-neutral-600"
            >
              {stage.milestones.map((item) => (
                <m.li key={item} variants={cascadeItemVariants}>
                  {item}
                </m.li>
              ))}
            </m.ul>
          </Section>
        )}
        {stage.stack.length > 0 && (
          <Section title="Stack">
            <Chips items={stage.stack} />
          </Section>
        )}
        {stage.learning && (
          <Section title="Aprendizado">
            <p className="text-sm leading-relaxed text-neutral-300">{stage.learning}</p>
          </Section>
        )}
        {extra?.kind === 'text' && (
          <Section title={extra.title}>
            <p className="text-sm leading-relaxed text-neutral-300">{extra.text}</p>
          </Section>
        )}
        {extra?.kind === 'diagnostic' && (
          <DiagnosticTabs swot={extra.swot} pdcaNote={extra.pdcaNote} pdca={extra.pdca} canvas={extra.canvas} />
        )}
      </div>
    </>
  );
}

function AboutBody() {
  return (
    <>
      <PanelHeading title={about.title} iconName={about.icon} />
      <p className="mt-3 text-sm leading-relaxed text-neutral-300">{about.description}</p>
      <hr className="my-6 border-line" />
      <Section title="Stack">
        <Chips items={about.stack} />
      </Section>
    </>
  );
}

export function SidePanel({
  selection,
  phase,
  onToggle,
  onContentHidden,
  onWidthSettled,
  onSelect,
  onBack,
}: SidePanelProps) {
  const reduced = useReducedMotion() ?? false;

  // `shown` fica um passo atrás de `selection`: entre os dois aparece a linha de log (~300ms).
  const [shown, setShown] = useState<Selection | null>(selection);
  const [log, setLog] = useState<RequestLog | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const lastSelection = useRef(selection);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const last = lastSelection.current;
    if (selectionKey(last) === selectionKey(selection)) {
      setLog(null);
      setShown(selection);
      return;
    }
    lastSelection.current = selection;
    setDirection(orderPosition(selection) >= orderPosition(last) ? 1 : -1);

    if (reduced || selection.kind === 'about') {
      setLog(null);
      setShown(selection);
      return;
    }

    setLog({ id: selection.id, ms: 8 + Math.floor(Math.random() * 33) });
    setShown(null);
    const timer = window.setTimeout(() => {
      setLog(null);
      setShown(selection);
    }, PANEL.logMs);
    return () => window.clearTimeout(timer);
  }, [selection, reduced]);

  const shownKey = shown ? selectionKey(shown) : null;
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [shownKey]);

  const collapsed = phase === 'collapsed';
  const currentStage = selection.kind === 'stage' ? stages[selection.id] : null;
  const RailIcon = icons[currentStage ? currentStage.icon : about.icon];
  const railTitle = currentStage ? currentStage.title : about.title;
  const neighbors = currentStage ? getNeighbors(currentStage.id) : null;

  function handleTransitionEnd(event: TransitionEvent<HTMLElement>) {
    if (event.target === event.currentTarget && event.propertyName === 'width') onWidthSettled();
  }

  return (
    <m.aside
      aria-label="Detalhes da etapa"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: BOOT.panelDelay, duration: BOOT.panelDuration, ease: 'easeOut' }}
      onTransitionEnd={handleTransitionEnd}
      className={`absolute inset-y-0 right-0 z-20 flex shrink-0 flex-col overflow-hidden border-l border-line bg-[#080808] transition-[width] duration-300 ease-out motion-reduce:transition-none lg:relative ${
        collapsed ? 'w-14' : 'w-[min(400px,100vw)]'
      }`}
    >
      {collapsed ? (
        <div className="flex w-14 flex-col items-center gap-4 py-4">
          <button type="button" onClick={onToggle} aria-label="Expandir painel" title="Expandir painel" className={iconButton}>
            <PanelRightOpen size={16} strokeWidth={1.5} />
          </button>
          <span className="h-px w-6 bg-line" />
          <span title={railTitle} className="grid h-9 w-9 place-items-center rounded-md border border-accent/40 text-accent">
            <RailIcon size={16} strokeWidth={1.5} />
          </span>
        </div>
      ) : (
        <m.div
          className="flex h-full w-[min(400px,100vw)] flex-col"
          initial={phase === 'expanded' ? false : { opacity: 0 }}
          animate={{ opacity: phase === 'expanded' ? 1 : 0 }}
          transition={{ duration: phase === 'collapsing' ? PANEL.fadeOut : PANEL.fadeIn, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (phase === 'collapsing') onContentHidden();
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
            {log ? (
              <p className="truncate font-mono text-[11px] text-accent">{logLine(log)}</p>
            ) : (
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                {shown && `● ${statusLine(shown)}`}
              </p>
            )}
            <button type="button" onClick={onToggle} aria-label="Compactar painel" title="Compactar painel" className={iconButton}>
              <PanelRightClose size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {shown && (
                <m.div
                  key={selectionKey(shown)}
                  custom={direction}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {shown.kind === 'stage' ? <StageBody stage={stages[shown.id]} /> : <AboutBody />}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 border-t border-line px-6 py-4">
            {neighbors ? (
              <>
                <button
                  type="button"
                  disabled={!neighbors.prev}
                  onClick={() => neighbors.prev && onSelect(neighbors.prev)}
                  className={`${navButton} text-left`}
                >
                  ← Etapa anterior
                </button>
                <button
                  type="button"
                  disabled={!neighbors.next}
                  onClick={() => neighbors.next && onSelect(neighbors.next)}
                  className={`${navButton} text-right`}
                >
                  Próxima etapa →
                </button>
              </>
            ) : (
              <button type="button" onClick={onBack} className={`${navButton} text-left`}>
                ← Voltar
              </button>
            )}
          </div>
        </m.div>
      )}
    </m.aside>
  );
}
