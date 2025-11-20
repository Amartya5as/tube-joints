import create from 'zustand';
import { nanoid } from 'nanoid';

const initialState = {
  tubes: [],
  selectedId: null,
  history: [],
  future: []
};

const useSceneStore = create((set, get) => ({
  ...initialState,
  addTube: (params) => {
    const id = nanoid();
    const tube = {
      id,
      ...params,
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    };
    set(state => {
      const next = { ...state, tubes: [...state.tubes, tube] };
      return {...next, history: [...state.history, state], future: [] };
    });
  },
  updateTube: (id, patch) => {
    set(state => {
      const tubes = state.tubes.map(t => t.id === id ? { ...t, ...patch } : t);
      return { ...state, tubes, history: [...state.history, state], future: [] };
    });
  },
  setTubesDirect: (tubes) => set(state => ({ ...state, tubes })),
  select: (id) => set({ selectedId: id }),
  undo: () => {
    const state = get();
    if (state.history.length === 0) return;
    const prev = state.history[state.history.length - 1];
    set({ ...prev, history: state.history.slice(0, -1), future: [state, ...state.future] });
  },
  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    set({ ...next, history: [...state.history, state], future: state.future.slice(1) });
  },
  removeTube: (id) => {
    set(state => {
      const tubes = state.tubes.filter(t => t.id !== id);
      return { ...state, tubes, history: [...state.history, state], future: [] };
    });
  }
}));

export default useSceneStore;
