import { Lock, BarChart3 } from 'lucide-react';
import { MASTERY_LEVELS } from '../../utils/scoring.js';

export default function MasteryBadge({ level = 0, compact = false }) {
  const meta = MASTERY_LEVELS[level] || MASTERY_LEVELS[0];
  const color = `var(${meta.colorVar})`;
  const filledBars = level; // 0..4
  return (
    <span
      className={`inline-flex items-center gap-2 ${compact ? 'text-[11px]' : 'text-xs'} font-mono uppercase tracking-wider`}
      style={{ color: level === 0 ? 'var(--text-muted)' : color }}
    >
      {level === 0 ? (
        <Lock size={12} />
      ) : (
        <span className="inline-flex items-end gap-[2px]" aria-hidden>
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block rounded-sm"
              style={{
                width: 3,
                height: 4 + i * 2,
                background: i <= filledBars ? color : 'var(--mastery-0)',
              }}
            />
          ))}
        </span>
      )}
      <span>{meta.label}</span>
    </span>
  );
}
