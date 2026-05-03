import Sidebar from './Sidebar.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-8 pb-20 md:pb-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
