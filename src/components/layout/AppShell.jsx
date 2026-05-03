import Sidebar from './Sidebar.jsx';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
