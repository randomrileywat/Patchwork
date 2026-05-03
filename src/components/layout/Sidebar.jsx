import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Swords, BookmarkCheck, Flame } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore.js';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/arena', label: 'Weak Area Arena', icon: Swords },
  { to: '/review', label: 'Review Queue', icon: BookmarkCheck, badgeKey: 'review' },
];

export default function Sidebar() {
  const { totalXP, currentStreak, reviewQueue } = useProgressStore();

  return (
    <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--bg-surface)] flex-col">
      <div className="p-5 flex items-center gap-3 border-b border-[var(--border)]">
        <svg viewBox="0 0 32 32" className="w-8 h-8">
          <path
            d="M2 16 L7 16 L9 8 L13 24 L17 6 L21 26 L25 12 L30 16"
            fill="none"
            stroke="var(--accent-teal)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <div className="font-mono font-bold tracking-wider text-[var(--text-primary)]">PATCHWORK</div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">CTS-D Prep</div>
        </div>
      </div>

      <nav className="px-3 py-4 flex-1">
        <div className="label-mono px-3 mb-2">Navigation</div>
        <ul className="space-y-1">
          {navLinks.map(({ to, label, icon: Icon, end, badgeKey }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border border-transparent',
                  ].join(' ')
                }
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badgeKey === 'review' && reviewQueue.length > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-coral)] text-[#0d0f14]">
                    {reviewQueue.length}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="border-t border-[var(--border)] my-5" />

        <div className="px-3 space-y-4">
          <div>
            <div className="label-mono">Streak</div>
            <div className={`flex items-center gap-2 mt-1 ${currentStreak > 0 ? 'text-[var(--accent-amber)]' : 'text-[var(--text-muted)]'}`}>
              <Flame size={18} />
              <span className="font-mono text-lg">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <div>
            <div className="label-mono">Total XP</div>
            <div className="font-mono text-2xl text-[var(--accent-teal)] mt-1">
              {totalXP.toLocaleString()} <span className="text-xs text-[var(--text-secondary)]">XP</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-[var(--border)] text-[10px] font-mono text-[var(--text-muted)] flex justify-between">
        <span>v0.1.0</span>
        <span>build · phase 1</span>
      </div>
    </aside>
  );
}
