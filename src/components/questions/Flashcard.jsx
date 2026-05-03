import { useState } from 'react';

export default function Flashcard({ question, onAnswered }) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[var(--accent-purple)] font-mono mb-3">
        Flashcard · click to flip
      </div>
      <div className="flip-card cursor-pointer" onClick={() => !answered && setFlipped((f) => !f)} style={{ minHeight: 220 }}>
        <div className="flip-inner relative" data-flipped={flipped}>
          <div className="flip-face surface p-8 min-h-[220px] flex items-center justify-center text-center">
            <div className="text-2xl font-mono text-[var(--text-primary)]">{question.front}</div>
          </div>
          <div className="flip-face flip-back surface-elevated p-8 min-h-[220px] flex items-center justify-center border-[var(--accent-purple)]">
            <div className="text-base text-[var(--text-primary)] leading-relaxed text-center">{question.back}</div>
          </div>
        </div>
      </div>

      {flipped && !answered && (
        <div className="mt-5 flex gap-3 justify-center">
          <button
            onClick={() => { setAnswered(true); onAnswered({ correct: false }); }}
            className="px-5 py-2 rounded-lg border border-[var(--accent-coral)] text-[var(--accent-coral)] font-mono text-sm hover:bg-rose-900/20"
          >
            Missed it
          </button>
          <button
            onClick={() => { setAnswered(true); onAnswered({ correct: true }); }}
            className="px-5 py-2 rounded-lg bg-[var(--accent-teal)] text-[#0d0f14] font-mono text-sm font-bold"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
