import { useMemo, useState } from 'react';
import { Trash2, Play } from 'lucide-react';
import questions from '../data/questions.json';
import { useProgressStore } from '../store/progressStore.js';
import SessionRunner from '../components/questions/SessionRunner.jsx';

export default function ReviewQueue() {
  const { reviewQueue, removeFromReviewQueue, bumpReviewAttempt, finishSession, markSessionStart } = useProgressStore();
  const [sortKey, setSortKey] = useState('addedAt');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [removing, setRemoving] = useState(new Set());

  const byId = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), []);

  const rows = useMemo(() => {
    const list = reviewQueue
      .map((r) => ({ ...r, q: byId[r.questionId] }))
      .filter((r) => r.q);
    if (sortKey === 'addedAt') list.sort((a, b) => b.addedAt - a.addedAt);
    if (sortKey === 'domain') list.sort((a, b) => a.q.domain.localeCompare(b.q.domain));
    if (sortKey === 'difficulty') list.sort((a, b) => b.q.difficulty - a.q.difficulty);
    return list;
  }, [reviewQueue, byId, sortKey]);

  const startInline = (question) => {
    markSessionStart();
    setActiveQuestion(question);
  };

  const handleFinish = (result) => {
    bumpReviewAttempt(activeQuestion.id);
    finishSession({ ...result, mode: 'review' });
    if (result.score === result.total && result.total > 0) {
      const id = activeQuestion.id;
      setRemoving((prev) => new Set(prev).add(id));
      setTimeout(() => removeFromReviewQueue(id), 700);
    }
    setActiveQuestion(null);
  };

  if (activeQuestion) {
    return (
      <div className="max-w-3xl mx-auto">
        <SessionRunner questions={[activeQuestion]} mode="review" onFinish={handleFinish} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-2xl">Review Queue</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Questions you've flagged or missed.</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="label-mono">Sort</span>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}
            className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm font-mono">
            <option value="addedAt">Date Added</option>
            <option value="domain">Domain</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="surface p-8 text-center text-[var(--text-muted)] text-sm">
          Your review queue is empty. Flag a question during practice to add it here.
        </div>
      ) : (
        <div className="surface divide-y divide-[var(--border)]">
          {rows.map((r) => (
            <div key={r.questionId}
              className={`flex items-center gap-4 px-4 py-3 transition-all ${removing.has(r.questionId) ? 'opacity-0 animate-flashTeal' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--text-primary)] truncate">
                  {r.q.question || r.q.front || '(no prompt)'}
                </div>
                <div className="flex gap-2 mt-1">
                  <Tag>{r.q.domain.toUpperCase()}</Tag>
                  <Tag>{r.q.subtopic}</Tag>
                  <Tag>DIFF {r.q.difficulty}</Tag>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">attempts: {r.attempts}</span>
                </div>
              </div>
              <button onClick={() => startInline(r.q)}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-[var(--accent-teal)] text-[#0d0f14] font-bold">
                <Play size={12} /> Attempt
              </button>
              <button onClick={() => removeFromReviewQueue(r.questionId)}
                className="text-[var(--text-muted)] hover:text-[var(--accent-coral)] p-1.5">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-secondary)]">
      {children}
    </span>
  );
}
