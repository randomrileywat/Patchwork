// Phase 2 stub — exports all Patchwork progress as a downloadable JSON blob.
import { STORAGE_KEYS } from './storage.js';

export function exportProgress() {
  const payload = {};
  Object.values(STORAGE_KEYS).forEach((k) => {
    const raw = localStorage.getItem(k);
    if (raw) {
      try { payload[k] = JSON.parse(raw); } catch { payload[k] = raw; }
    }
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `patchwork-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
