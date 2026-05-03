import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';

// Click-based pairing UI: pick a left term, then click a right definition to bind.
// Submit reveals correct/incorrect pairings.
export default function DragMatch({ question, onAnswered }) {
  const pairs = question.pairs || [];
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [bindings, setBindings] = useState({}); // term -> definition
  const [submitted, setSubmitted] = useState(false);

  const shuffledRight = useMemo(() => {
    const arr = pairs.map((p) => p.definition);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const usedDefs = new Set(Object.values(bindings));
  const allBound = pairs.every((p) => bindings[p.term]);

  const handleLeft = (term) => {
    if (submitted) return;
    setSelectedLeft(term);
  };

  const handleRight = (def) => {
    if (submitted) return;
    if (!selectedLeft) return;
    if (usedDefs.has(def)) return;
    const next = { ...bindings, [selectedLeft]: def };
    setBindings(next);
    setSelectedLeft(null);
  };

  const handleClear = (term) => {
    if (submitted) return;
    const next = { ...bindings };
    delete next[term];
    setBindings(next);
  };

  const submit = () => {
    if (!allBound) return;
    setSubmitted(true);
    const allCorrect = pairs.every((p) => bindings[p.term] === p.definition);
    onAnswered({ correct: allCorrect, bindings });
  };

  const isPairCorrect = (term) => bindings[term] === pairs.find((p) => p.term === term)?.definition;

  return (
    <div>
      <div className="text-lg mb-5 text-[var(--text-primary)]">{question.question}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="label-mono mb-1">Terms</div>
          {pairs.map((p) => {
            const bound = bindings[p.term];
            const isSelected = selectedLeft === p.term;
            let cls = 'border-[var(--border)] hover:border-[var(--border-accent)]';
            if (submitted) cls = isPairCorrect(p.term)
              ? 'border-[var(--accent-teal)] bg-teal-900/20'
              : 'border-[var(--accent-coral)] bg-rose-900/20';
            else if (isSelected) cls = 'border-[var(--accent-blue)] bg-[var(--bg-elevated)]';
            else if (bound) cls = 'border-[var(--border-accent)] bg-[var(--bg-elevated)]';
            return (
              <div key={p.term}
                onClick={() => handleLeft(p.term)}
                className={`px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${cls}`}>
                <div className="font-mono text-[var(--text-primary)]">{p.term}</div>
                {bound && (
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center justify-between gap-2">
                    <span className="truncate">→ {bound}</span>
                    {!submitted && (
                      <button onClick={(e) => { e.stopPropagation(); handleClear(p.term); }}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-coral)]">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <div className="label-mono mb-1">Definitions</div>
          {shuffledRight.map((def) => {
            const used = usedDefs.has(def);
            const cls = used
              ? 'border-[var(--border-accent)] bg-[var(--bg-elevated)] opacity-50 cursor-not-allowed'
              : selectedLeft
                ? 'border-[var(--accent-blue)] hover:bg-[var(--bg-elevated)] cursor-pointer'
                : 'border-[var(--border)] cursor-default';
            return (
              <div key={def}
                onClick={() => handleRight(def)}
                className={`px-3 py-2.5 rounded-lg border text-sm text-[var(--text-primary)] ${cls}`}>
                {def}
              </div>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <div className="mt-5 flex justify-between items-center">
          <div className="text-xs text-[var(--text-muted)] font-mono">
            {selectedLeft ? `Click a definition to bind "${selectedLeft}"` : 'Click a term, then a definition.'}
          </div>
          <button
            onClick={submit}
            disabled={!allBound}
            className="px-5 py-2 rounded-lg bg-[var(--accent-teal)] text-[#0d0f14] font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mt-5 surface-elevated p-4">
          <div className="label-mono mb-2 flex items-center gap-2">
            Results
            {pairs.every((p) => isPairCorrect(p.term)) ? (
              <Check size={14} className="text-[var(--accent-teal)]" />
            ) : (
              <X size={14} className="text-[var(--accent-coral)]" />
            )}
          </div>
          <ul className="text-sm space-y-1">
            {pairs.map((p) => (
              <li key={p.term} className="flex gap-2">
                <span className="font-mono text-[var(--text-secondary)] w-32 shrink-0">{p.term}</span>
                <span className={isPairCorrect(p.term) ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-coral)]'}>
                  {p.definition}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
