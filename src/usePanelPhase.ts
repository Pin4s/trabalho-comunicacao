import { useCallback, useEffect, useState } from 'react';

/**
 * expanded   → painel aberto, conteúdo visível
 * collapsing → conteúdo some (fade out) antes da largura encolher
 * collapsed  → trilho fino
 * expanding  → largura cresce; o conteúdo só aparece (fade in) depois
 */
export type PanelPhase = 'expanded' | 'collapsing' | 'collapsed' | 'expanding';

const WIDTH_FALLBACK_MS = 450;

export function usePanelPhase(reduced: boolean) {
  const [phase, setPhase] = useState<PanelPhase>('expanded');

  const expand = useCallback(() => {
    setPhase((current) => {
      if (current === 'collapsed') return reduced ? 'expanded' : 'expanding';
      if (current === 'collapsing') return 'expanded';
      return current;
    });
  }, [reduced]);

  const toggle = useCallback(() => {
    setPhase((current) => {
      if (current === 'expanded') return reduced ? 'collapsed' : 'collapsing';
      if (current === 'collapsed') return reduced ? 'expanded' : 'expanding';
      return current;
    });
  }, [reduced]);

  const onContentHidden = useCallback(() => {
    setPhase((current) => (current === 'collapsing' ? 'collapsed' : current));
  }, []);

  const onWidthSettled = useCallback(() => {
    setPhase((current) => (current === 'expanding' ? 'expanded' : current));
  }, []);

  // Garantia caso o transitionend da largura não dispare.
  useEffect(() => {
    if (phase !== 'expanding') return;
    const timer = window.setTimeout(onWidthSettled, WIDTH_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [phase, onWidthSettled]);

  return { phase, expand, toggle, onContentHidden, onWidthSettled };
}
