// localStorage helpers (Zustand persist handles most cases; these are for ad-hoc ops)
export const safeGet = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or serialization issue — ignore for single-user app */
  }
};

export const STORAGE_KEYS = {
  PROGRESS: 'patchwork_progress',
  SESSIONS: 'patchwork_sessions',
  XP: 'patchwork_xp',
  REVIEW: 'patchwork_review_queue',
  SETTINGS: 'patchwork_settings',
};

export const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const daysBetween = (isoA, isoB) => {
  const a = new Date(isoA + 'T00:00:00');
  const b = new Date(isoB + 'T00:00:00');
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};
