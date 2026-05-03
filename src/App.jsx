import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './views/Dashboard.jsx';
import PracticeSession from './views/PracticeSession.jsx';
import WeakAreaArena from './views/WeakAreaArena.jsx';
import ReviewQueue from './views/ReviewQueue.jsx';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/practice" element={<PracticeSession />} />
        <Route path="/arena" element={<WeakAreaArena />} />
        <Route path="/review" element={<ReviewQueue />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
