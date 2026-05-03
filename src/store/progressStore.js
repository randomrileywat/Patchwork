import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { computeRollingScore, masteryLevelFromScore, xpForCorrect } from '../utils/scoring.js';
import { todayISO, daysBetween, STORAGE_KEYS } from '../utils/storage.js';

const initialState = {
  topics: {},          // { [subtopicId]: { attempts: [{questionId, correct, timestamp, difficulty}], xpEarned, masteryLevel } }
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  sessions: [],        // [{ id, startedAt, endedAt, score, total, topicBreakdown, xpEarned, mode }]
  reviewQueue: [],     // [{ questionId, addedAt, attempts: 0 }]
  recentQuestionIds: [], // last 10 picks (for picker dedup)
};

const ensureTopic = (state, subtopic) => {
  if (!state.topics[subtopic]) {
    state.topics[subtopic] = { attempts: [], xpEarned: 0, masteryLevel: 0 };
  }
};

export const useProgressStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      recordAttempt: ({ question, correct, multiplier = 1 }) => {
        const state = get();
        const next = { ...state, topics: { ...state.topics } };
        ensureTopic(next, question.subtopic);
        const t = { ...next.topics[question.subtopic] };
        t.attempts = [
          ...t.attempts,
          {
            questionId: question.id,
            correct,
            timestamp: Date.now(),
            difficulty: question.difficulty,
          },
        ];
        const prevScore = computeRollingScore(state.topics[question.subtopic]?.attempts || []) ?? 0;
        const prevLevel = masteryLevelFromScore(prevScore, (state.topics[question.subtopic]?.attempts || []).length).level;
        const newScore = computeRollingScore(t.attempts);
        const newLevel = masteryLevelFromScore(newScore, t.attempts.length).level;

        let xpDelta = 0;
        if (correct) xpDelta += xpForCorrect(question.difficulty, multiplier);
        const leveledUp = newLevel > prevLevel;
        if (leveledUp) xpDelta += 100;

        t.xpEarned = (t.xpEarned || 0) + xpDelta;
        t.masteryLevel = newLevel;
        next.topics[question.subtopic] = t;

        // Track recent picks (rolling 10)
        const recent = [...state.recentQuestionIds, question.id].slice(-10);

        set({
          topics: next.topics,
          totalXP: state.totalXP + xpDelta,
          recentQuestionIds: recent,
        });

        return { xpDelta, leveledUp, newLevel, prevLevel };
      },

      finishSession: ({ score, total, topicBreakdown, xpEarned, mode = 'practice' }) => {
        const state = get();
        const today = todayISO();
        let { currentStreak, longestStreak, lastSessionDate, totalXP } = state;

        if (total >= 5) {
          if (!lastSessionDate) {
            currentStreak = 1;
          } else if (lastSessionDate === today) {
            // already counted today
          } else {
            const gap = daysBetween(lastSessionDate, today);
            if (gap === 1) {
              currentStreak += 1;
              totalXP += 50; // streak XP
            } else if (gap > 1) {
              currentStreak = 1;
            }
          }
          if (currentStreak > longestStreak) longestStreak = currentStreak;
          lastSessionDate = today;
        }

        const sessionBonus = total >= 10 ? 25 : 0;
        totalXP += sessionBonus;

        const session = {
          id: `s-${Date.now()}`,
          endedAt: Date.now(),
          startedAt: state._sessionStartedAt || Date.now(),
          score,
          total,
          pct: total > 0 ? Math.round((score / total) * 100) : 0,
          topicBreakdown,
          xpEarned: xpEarned + sessionBonus + (currentStreak !== state.currentStreak ? 50 : 0),
          mode,
          date: today,
        };

        set({
          sessions: [...state.sessions, session].slice(-200),
          currentStreak,
          longestStreak,
          lastSessionDate,
          totalXP,
          _sessionStartedAt: null,
        });
        return session;
      },

      markSessionStart: () => set({ _sessionStartedAt: Date.now() }),

      addToReviewQueue: (questionId) => {
        const state = get();
        if (state.reviewQueue.find((r) => r.questionId === questionId)) return;
        set({
          reviewQueue: [
            ...state.reviewQueue,
            { questionId, addedAt: Date.now(), attempts: 0 },
          ],
        });
      },

      removeFromReviewQueue: (questionId) => {
        const state = get();
        set({ reviewQueue: state.reviewQueue.filter((r) => r.questionId !== questionId) });
      },

      bumpReviewAttempt: (questionId) => {
        const state = get();
        set({
          reviewQueue: state.reviewQueue.map((r) =>
            r.questionId === questionId ? { ...r, attempts: r.attempts + 1 } : r
          ),
        });
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: STORAGE_KEYS.PROGRESS,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
