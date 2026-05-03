import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Play } from 'lucide-react';
import questions from '../data/questions.json';
import { pickWeakAreaQuestions, targetedWeakTopics } from '../utils/questionPicker.js';
import { useProgressStore } from '../store/progressStore.js';
import SessionRunner from '../components/questions/SessionRunner.jsx';
import MasteryBadge from '../components/shared/MasteryBadge.jsx';
import { masteryLevelFromScore } from '../utils/scoring.js';

export default function WeakAreaArena() {
  const navigate = useNavigate();
  const progress = useProgressStore();
  const finishSession = useProgressStore((s) => s.finishSession);
  const markSessionStart = useProgressStore((s) => s.markSessionStart);
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);

  const targets = targetedWeakTopics(progress);
  const eligible = targets.length > 0;

  const start = () => {
    const picked = pickWeakAreaQuestions(questions, progress, 20, progress.recentQuestionIds);
    if (picked.length === 0) {
      alert('Not enough question coverage to build an arena session yet.');
      return;
    }
    markSessionStart();
    setSession({ questions: picked });
    setSummary(null);
  };

  const handleFinish = (result) => {
    const rec = finishSession({ ...result, mode: 'arena' });
    setSummary({ ...result, sessionRecord: rec });
    setSession(null);
  };

  if (session) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 px-4 py-3 rounded-lg border border-[var(--accent-amber)] bg-amber-950/20 text-[var(--accent-amber)] font-mono text-sm flex items-center gap-2">
          <Swords size={14} />
          1.5× XP Active · Targeting your 3 weakest topics
        </div>
        <SessionRunner
          questions={session.questions}
          mode="arena"
          multiplier={1.5}
          arenaTone
          onFinish={handleFinish}
        />
      </div>
    );
  }

  if (summary) {
    const pct = summary.total > 0 ? Math.round((summary.score / summary.total) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="surface p-8 text-center border-[var(--accent-amber)]">
          <div className="label-mono mb-2 text-[var(--accent-amber)]">Arena complete</div>
          <div className="text-6xl font-mono font-bold text-[var(--accent-amber)]">{summary.score} / {summary.total}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-2">{pct}% · +{summary.xpEarned} XP (1.5× multiplier)</div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={start} className="px-5 py-2.5 rounded-lg bg-[var(--accent-amber)] text-[#0d0f14] font-mono text-sm font-bold">Run Again</button>
          <button onClick={() => navigate('/')} className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] font-mono text-sm">Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <div className="flex items-center gap-2 text-[var(--accent-amber)]">
          <Swords size={20} />
          <span className="text-2xl font-mono">Weak Area Arena</span>
        </div>
        <div className="text-sm text-[var(--text-secondary)] mt-2">
          A focused 20-question session targeting your 3 weakest topics. Earn 1.5× XP for every correct answer.
        </div>
      </header>

      <section className="surface p-5 border-[var(--accent-amber)]/40">
        <div className="label-mono mb-3 text-[var(--accent-amber)]">Targets</div>
        {eligible ? (
          <ul className="space-y-2">
            {targets.map((t, idx) => (
              <li key={t.subtopic} className="flex items-center gap-3 text-sm">
                <span className="w-7 font-mono text-[var(--accent-amber)]">#{idx + 1}</span>
                <span className="flex-1 text-[var(--text-primary)]">{t.subtopic.replace(/-/g, ' ')}</span>
                <MasteryBadge level={masteryLevelFromScore(t.score, t.attempts).level} compact />
                <span className="font-mono text-xs text-[var(--text-secondary)]">{Math.round(t.score * 100)}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-[var(--text-muted)]">
            Complete at least 5 questions in 3 different topics during regular practice to unlock arena targeting.
            For now, the arena will pull a random spread.
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button onClick={start}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-amber)] text-[#0d0f14] font-mono text-sm font-bold">
          <Play size={14} />
          Enter Arena (20 questions)
        </button>
      </div>
    </div>
  );
}
