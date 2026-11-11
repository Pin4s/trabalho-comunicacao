import type { ReactNode } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { about, getNeighbors, stages, statusLabels, type Stage, type StageId } from '../data/career';
import type { Selection } from '../selection';
import { icons } from './icons';
import { DiagnosticTabs } from './DiagnosticTabs';

interface SidePanelProps {
  selection: Selection;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (id: StageId) => void;
  onBack: () => void;
}

const iconButton =
  'grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line text-neutral-400 hover:border-accent hover:text-accent';

const navButton =
  'flex-1 rounded-md border border-line px-3 py-2.5 font-mono text-xs text-neutral-300 hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30';

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
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded border border-[#2a2a2a] px-2 py-0.5 font-mono text-[11px] text-neutral-300">
          {item}
        </li>
      ))}
    </ul>
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
            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-neutral-300 marker:text-neutral-600">
              {stage.milestones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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

export function SidePanel({ selection, collapsed, onToggle, onSelect, onBack }: SidePanelProps) {
  const stage = selection.kind === 'stage' ? stages[selection.id] : null;
  const iconName = stage ? stage.icon : about.icon;
  const title = stage ? stage.title : about.title;
  const RailIcon = icons[iconName];

  let statusLine: string;
  if (stage) {
    const period = stage.period === '—' ? '' : ` · ${stage.period}`;
    statusLine = `${statusLabels[stage.status]}${period}`;
  } else {
    statusLine = about.label;
  }

  const neighbors = stage ? getNeighbors(stage.id) : null;
  const contentKey = stage ? stage.id : 'about';

  return (
    <aside
      aria-label="Detalhes da etapa"
      className={`absolute inset-y-0 right-0 z-20 flex shrink-0 flex-col overflow-hidden border-l border-line bg-[#080808] transition-[width] duration-300 ease-out lg:relative ${
        collapsed ? 'w-14' : 'w-[min(400px,100vw)]'
      }`}
    >
      {collapsed ? (
        <div className="flex w-14 flex-col items-center gap-4 py-4">
          <button type="button" onClick={onToggle} aria-label="Expandir painel" title="Expandir painel" className={iconButton}>
            <PanelRightOpen size={16} strokeWidth={1.5} />
          </button>
          <span className="h-px w-6 bg-line" />
          <span title={title} className="grid h-9 w-9 place-items-center rounded-md border border-accent/40 text-accent">
            <RailIcon size={16} strokeWidth={1.5} />
          </span>
        </div>
      ) : (
        <div className="flex h-full w-[min(400px,100vw)] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent">● {statusLine}</p>
            <button type="button" onClick={onToggle} aria-label="Compactar painel" title="Compactar painel" className={iconButton}>
              <PanelRightClose size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div key={contentKey} className="flex-1 overflow-y-auto px-6 py-6">
            {stage ? <StageBody stage={stage} /> : <AboutBody />}
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
        </div>
      )}
    </aside>
  );
}
