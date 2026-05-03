export default function ProgressRing({ value, total, size = 64, stroke = 6 }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = total > 0 ? value / total : 0;
  const dashOffset = circumference * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--border)" strokeWidth={stroke} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--accent-teal)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 300ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs">
        <span className="text-[var(--text-primary)]">{value}</span>
        <span className="text-[var(--text-muted)]">/{total}</span>
      </div>
    </div>
  );
}
