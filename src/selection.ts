import { createContext, useContext } from 'react';
import type { StageId } from './data/career';

/** O que o painel lateral está mostrando. */
export type Selection = { kind: 'stage'; id: StageId } | { kind: 'about'; returnTo: StageId };

interface SelectionContextValue {
  selectedId: StageId | null;
  select: (id: StageId) => void;
}

export const SelectionContext = createContext<SelectionContextValue>({
  selectedId: null,
  select: () => undefined,
});

export function useSelection(): SelectionContextValue {
  return useContext(SelectionContext);
}

export function baseStageId(selection: Selection): StageId {
  return selection.kind === 'stage' ? selection.id : selection.returnTo;
}
