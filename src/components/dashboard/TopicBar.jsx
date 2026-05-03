import MasteryBadge from '../shared/MasteryBadge.jsx';
import { MASTERY_LEVELS } from '../../utils/scoring.js';

export default function TopicBar({ name, score, attempts, level }) {
  const pct = attempts > 0 ? Math.round(score * 100) : 0;
  const color = `var(${MASTERY_LEVELS[level || 0].colorVar})`;
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-44 shrink-0">
        <div className="text-sm text-[var(--text-primary)]">{name}</div>
        <div className="mt-0.5"><MasteryBadge level={level} compact /></div>
      </div>
      <div className="flex-1">
        <div className="h-2.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: attempts > 0 ? color : 'var(--mastery-0)' }}
          />
        </div>
      </div>
      <div className="w-20 text-right font-mono text-sm" style={{ color: attempts > 0 ? color : 'var(--text-muted)' }}>
        {attempts > 0 ? `${pct}%` : '—'}
      </div>
      <div className="w-16 text-right text-[11px] text-[var(--text-muted)] font-mono">
        {attempts} att
      </div>
    </div>
  );
}
