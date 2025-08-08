import { useCallback, useState } from 'react';

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initial: T) {
  const [{ past, present, future }, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initial,
    future: [],
  });

  const set = useCallback((next: T) => {
    setHistory((state) => ({
      past: [...state.past, state.present],
      present: next,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((state) => {
      if (state.past.length === 0) return state;
      const newPast = state.past.slice(0, -1);
      const prev = state.past[state.past.length - 1];
      return {
        past: newPast,
        present: prev,
        future: [state.present, ...state.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((state) => {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    });
  }, []);

  return {
    past,
    present,
    future,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  } as const;
}

