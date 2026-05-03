import { create } from 'zustand';

// Ephemeral session state — current question flow. Not persisted.
export const useSessionStore = create((set, get) => ({
  active: false,
  mode: 'practice',           // 'practice' | 'arena' | 'review'
  multiplier: 1,
  questions: [],
  index: 0,
  responses: [],              // [{ questionId, correct, skipped, xpDelta, leveledUp }]
  flagged: new Set(),
  filters: null,
  finished: false,

  startSession: ({ questions, mode = 'practice', multiplier = 1, filters = null }) => {
    set({
      active: true,
      mode,
      multiplier,
      questions,
      index: 0,
      responses: [],
      flagged: new Set(),
      filters,
      finished: false,
    });
  },

  recordResponse: (response) => {
    const state = get();
    set({ responses: [...state.responses, response] });
  },

  next: () => {
    const state = get();
    if (state.index + 1 >= state.questions.length) {
      set({ finished: true });
    } else {
      set({ index: state.index + 1 });
    }
  },

  toggleFlag: (questionId) => {
    const state = get();
    const next = new Set(state.flagged);
    if (next.has(questionId)) next.delete(questionId);
    else next.add(questionId);
    set({ flagged: next });
  },

  reset: () => set({
    active: false,
    questions: [],
    index: 0,
    responses: [],
    flagged: new Set(),
    finished: false,
  }),
}));
