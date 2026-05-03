import { useEffect, useState } from 'react';

export default function XPToast({ amount, leveledUp }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, []);
  if (!visible || !amount) return null;
  return (
    <div
      className="absolute right-4 top-2 pointer-events-none animate-xpfloat font-mono text-sm"
      style={{ color: leveledUp ? 'var(--accent-amber)' : 'var(--accent-teal)' }}
    >
      +{amount} XP{leveledUp ? ' · LEVEL UP' : ''}
    </div>
  );
}
