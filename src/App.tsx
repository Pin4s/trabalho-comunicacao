import { useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig, useReducedMotion } from 'motion/react';
import { getNeighbors, site, type StageId } from './data/career';
import { SelectionContext, baseStageId, type Selection } from './selection';
import { usePanelPhase } from './usePanelPhase';
import { CareerFlow } from './flow/CareerFlow';
import { SidePanel } from './components/SidePanel';

export function App() {
  // prefers-reduced-motion: todas as animações do motion viram troca direta (inclusive delays).
  const reduced = useReducedMotion() ?? false;
  const [selection, setSelection] = useState<Selection>({ kind: 'stage', id: 'atual' });
  const panel = usePanelPhase(reduced);
  const { expand } = panel;

  const select = useCallback(
    (id: StageId) => setSelection((prev) => (prev.kind === 'stage' && prev.id === id ? prev : { kind: 'stage', id })),
    [],
  );

  const openAbout = useCallback(() => {
    setSelection((prev) => (prev.kind === 'about' ? prev : { kind: 'about', returnTo: prev.id }));
    expand();
  }, [expand]);

  const closeAbout = useCallback(() => {
    setSelection((prev) => ({ kind: 'stage', id: baseStageId(prev) }));
  }, []);

  // Setas ← → navegam pela ordem principal (a Gestão só abre por clique).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      setSelection((prev) => {
        const neighbors = getNeighbors(baseStageId(prev));
        const target = event.key === 'ArrowLeft' ? neighbors.prev : neighbors.next;
        return target ? { kind: 'stage', id: target } : prev;
      });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const contextValue = useMemo(
    () => ({ selectedId: selection.kind === 'stage' ? selection.id : null, select }),
    [selection, select],
  );

  return (
    <MotionConfig skipAnimations={reduced}>
      <SelectionContext.Provider value={contextValue}>
        <div className="relative flex h-dvh w-full overflow-hidden bg-ink text-neutral-200">
          <main className="flex min-w-0 flex-1 flex-col">
            <header className="px-6 pr-[72px] pt-6 sm:px-10 sm:pr-[72px] sm:pt-8 lg:pr-10">
              <div className="flex max-w-2xl items-center gap-4 font-mono text-[11px] text-neutral-500">
                <span className="text-accent">&gt;_</span>
                <span className="tracking-[0.3em]">{site.label}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h1 className="mt-4 font-mono text-2xl font-bold tracking-tight text-white sm:text-4xl">
                {site.title}
                <span className="cursor-blink text-accent">_</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">{site.subtitle}</p>
            </header>

            {/* < lg o painel é overlay: reserva a largura do trilho compactado pro fluxo não ficar escondido */}
            <div className="relative mr-14 min-h-0 flex-1 lg:mr-0">
              <CareerFlow />
            </div>

            <footer className="flex items-center gap-3 px-6 pb-5 pr-[72px] font-mono text-[11px] text-neutral-500 sm:px-10 sm:pr-[72px] lg:pr-10">
              <span className="text-accent">&gt;_</span>
              <span className="text-neutral-700">|</span>
              <span className="whitespace-nowrap">{site.footerPeriod}</span>
              <span className="hidden text-neutral-700 sm:inline">|</span>
              <span className="hidden whitespace-nowrap sm:inline">{site.footerModel}</span>
              <span className="h-px min-w-4 flex-1 bg-line" />
              <button
                type="button"
                onClick={openAbout}
                className="whitespace-nowrap text-neutral-500 underline-offset-4 hover:text-accent hover:underline"
              >
                {site.aboutLink}
              </button>
            </footer>
          </main>

          <SidePanel
            selection={selection}
            phase={panel.phase}
            onToggle={panel.toggle}
            onContentHidden={panel.onContentHidden}
            onWidthSettled={panel.onWidthSettled}
            onSelect={select}
            onBack={closeAbout}
          />
        </div>
      </SelectionContext.Provider>
    </MotionConfig>
  );
}
