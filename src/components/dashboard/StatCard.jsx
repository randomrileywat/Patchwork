export default function StatCard({ label, value, hint, accent = 'teal' }) {
  const accentColor = {
    teal: 'var(--accent-teal)',
    amber: 'var(--accent-amber)',
    blue: 'var(--accent-blue)',
    purple: 'var(--accent-purple)',
  }[accent] || 'var(--accent-teal)';
  return (
    <div className="surface p-4">
      <div className="label-mono">{label}</div>
      <div className="font-mono text-2xl mt-2" style={{ color: accentColor }}>{value}</div>
      {hint && <div className="text-xs text-[var(--text-muted)] mt-1">{hint}</div>}
    </div>
  );
}
