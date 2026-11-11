import { useState } from 'react';
import type { CanvasBlock, PdcaStep, Quadrant } from '../data/career';

type TabId = 'swot' | 'pdca' | 'canvas';

const tabs: { id: TabId; label: string }[] = [
  { id: 'swot', label: 'SWOT' },
  { id: 'pdca', label: 'PDCA' },
  { id: 'canvas', label: 'Canvas' },
];

interface DiagnosticTabsProps {
  swot: Quadrant[];
  pdcaNote: string;
  pdca: PdcaStep[];
  canvas: CanvasBlock[];
}

const boxTitle = 'font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent';

export function DiagnosticTabs({ swot, pdcaNote, pdca, canvas }: DiagnosticTabsProps) {
  const [active, setActive] = useState<TabId>('swot');

  return (
    <div>
      <div role="tablist" className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-xs ${
                isActive
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-line text-neutral-500 hover:border-[#333] hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-4">
        {active === 'swot' && (
          <div className="grid grid-cols-2 gap-2">
            {swot.map((quadrant) => (
              <div key={quadrant.title} className="rounded-md border border-line bg-surface p-3">
                <h4 className={boxTitle}>{quadrant.title}</h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-3.5 text-xs leading-snug text-neutral-300 marker:text-neutral-600">
                  {quadrant.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {active === 'pdca' && (
          <div>
            <p className="mb-3 text-xs text-neutral-500">{pdcaNote}</p>
            <ol className="divide-y divide-line rounded-md border border-line bg-surface">
              {pdca.map((step) => (
                <li key={step.letter} className="flex gap-4 p-3.5">
                  <span className="w-4 shrink-0 font-mono text-lg font-bold leading-6 text-accent">{step.letter}</span>
                  <div>
                    <p className="font-mono text-xs font-semibold leading-6 text-white">{step.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-300">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {active === 'canvas' && (
          <div className="grid grid-cols-2 gap-2">
            {canvas.map((block) => (
              <div key={block.title} className="rounded-md border border-line bg-surface p-3">
                <h4 className={boxTitle}>{block.title}</h4>
                <p className="mt-2 text-xs leading-snug text-neutral-300">{block.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
