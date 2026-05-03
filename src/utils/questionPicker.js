// Weighted question selection, including the Weak Area Arena algorithm.
import { computeRollingScore } from './scoring.js';

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const filterUnseen = (pool, recentIds) => {
  const blocked = new Set(recentIds || []);
  const available = pool.filter((q) => !blocked.has(q.id));
  return available.length > 0 ? available : pool;
};

// Difficulty-weighted draw — favor 2 and 3 for arena/realistic prep.
const drawByDifficulty = (pool) => {
  const weights = { 1: 1, 2: 3, 3: 3 };
  const expanded = [];
  pool.forEach((q) => {
    const w = weights[q.difficulty] || 1;
    for (let i = 0; i < w; i++) expanded.push(q);
  });
  return sample(expanded);
};

export const pickRandomFromFilters = (allQuestions, filters, count, recentIds = []) => {
  let pool = allQuestions.slice();

  if (filters.domains && filters.domains.length > 0) {
    pool = pool.filter((q) => filters.domains.includes(q.domain));
  }
  if (filters.subtopics && filters.subtopics.length > 0) {
    pool = pool.filter((q) => filters.subtopics.includes(q.subtopic));
  }
  if (filters.types && filters.types.length > 0) {
    pool = pool.filter((q) => filters.types.includes(q.type));
  }
  if (filters.difficulty && filters.difficulty.length > 0) {
    pool = pool.filter((q) => filters.difficulty.includes(q.difficulty));
  }

  pool = filterUnseen(pool, recentIds);
  if (pool.length === 0) return [];

  const picked = [];
  const usedIds = new Set();
  let safety = count * 25;
  while (picked.length < count && safety-- > 0) {
    const q = drawByDifficulty(pool);
    if (!usedIds.has(q.id)) {
      usedIds.add(q.id);
      picked.push(q);
    }
    if (usedIds.size >= pool.length) break;
  }
  return picked;
};

// Weak Area Arena — bottom 3 topics by rollingScore, weighted 50/30/20.
export const pickWeakAreaQuestions = (allQuestions, progress, count = 20, recentIds = []) => {
  const topics = Object.entries(progress?.topics || {})
    .map(([subtopic, t]) => ({
      subtopic,
      attempts: (t.attempts || []).length,
      score: computeRollingScore(t.attempts || []) ?? 1.0,
    }))
    .filter((t) => t.attempts >= 5)
    .sort((a, b) => a.score - b.score);

  const target = topics.slice(0, 3);
  const weights = [0.5, 0.3, 0.2];

  const picks = [];
  const used = new Set();

  if (target.length > 0) {
    target.forEach((t, idx) => {
      const slots = Math.round(count * (weights[idx] || 0));
      const pool = filterUnseen(
        allQuestions.filter((q) => q.subtopic === t.subtopic),
        recentIds
      );
      let safety = slots * 25;
      let added = 0;
      while (added < slots && safety-- > 0 && pool.length > 0) {
        const q = drawByDifficulty(pool);
        if (!used.has(q.id)) {
          used.add(q.id);
          picks.push(q);
          added += 1;
        }
        if (used.size >= pool.length + picks.length) break;
      }
    });
  }

  // Fill any remaining slots with random unseen questions
  if (picks.length < count) {
    const fillerPool = filterUnseen(allQuestions, [...recentIds, ...used]);
    let safety = (count - picks.length) * 25;
    while (picks.length < count && safety-- > 0 && fillerPool.length > 0) {
      const q = sample(fillerPool);
      if (!used.has(q.id)) {
        used.add(q.id);
        picks.push(q);
      }
      if (used.size >= fillerPool.length + picks.length) break;
    }
  }

  return picks.slice(0, count);
};

export const targetedWeakTopics = (progress) => {
  const topics = Object.entries(progress?.topics || {})
    .map(([subtopic, t]) => ({
      subtopic,
      attempts: (t.attempts || []).length,
      score: computeRollingScore(t.attempts || []) ?? 1.0,
    }))
    .filter((t) => t.attempts >= 5)
    .sort((a, b) => a.score - b.score);
  return topics.slice(0, 3);
};
