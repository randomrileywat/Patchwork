import { useState } from 'react';
import { Check, X } from 'lucide-react';

// Supports both single-correct ("mc") and multi-correct ("mc-multi").
// `correct` may be a string ("B") or an array of strings (["A","C"]).
export default function MultipleChoice({ question, onAnswered }) {
  const isMulti = question.type === 'mc-multi';
  const correctSet = new Set(Array.isArray(question.correct) ? question.correct : [question.correct]);
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const optionLetter = (opt) => {
    const m = opt.match(/^([A-Z])\./);
    return m ? m[1] : opt[0];
  };

  const toggle = (letter) => {
    if (submitted) return;
    if (isMulti) {
      const next = new Set(selected);
      if (next.has(letter)) next.delete(letter); else next.add(letter);
      setSelected(next);
    } else {
      setSelected(new Set([letter]));
    }
  };

  const submit = () => {
    if (submitted || selected.size === 0) return;
    setSubmitted(true);
    const isCorrect =
      selected.size === correctSet.size &&
      [...selected].every((s) => correctSet.has(s));
    onAnswered({ correct: isCorrect, selected: [...selected] });
  };

  return (
    <div>
      <div className="text-lg leading-relaxed mb-5 text-[var(--text-primary)]">{question.question}</div>

      <div className="space-y-2">
        {question.options.map((opt) => {
          const letter = optionLetter(opt);
          const isSelected = selected.has(letter);
          const isCorrectOption = correctSet.has(letter);
          let cls = 'border-[var(--border)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-elevated)]';
          if (submitted) {
            if (isCorrectOption) cls = 'border-[var(--accent-teal)] bg-teal-900/20 ring-1 ring-[var(--accent-teal)]';
            else if (isSelected) cls = 'border-[var(--accent-coral)] bg-rose-900/20 ring-1 ring-[var(--accent-coral)] animate-shake';
          } else if (isSelected) {
            cls = 'border-[var(--border-accent)] bg-[var(--bg-elevated)]';
          }
          return (
            <button
              key={letter}
              type="button"
              onClick={() => toggle(letter)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-start gap-3 ${cls}`}
              disabled={submitted}
            >
              <span className="font-mono text-sm w-6 shrink-0 text-[var(--text-secondary)]">{letter}</span>
              <span className="flex-1 text-sm text-[var(--text-primary)]">{opt.replace(/^[A-Z]\.\s*/, '')}</span>
              {submitted && isCorrectOption && <Check size={16} className="text-[var(--accent-teal)] mt-1" />}
              {submitted && !isCorrectOption && isSelected && <X size={16} className="text-[var(--accent-coral)] mt-1" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-5 flex justify-end">
          <button
            onClick={submit}
            disabled={selected.size === 0}
            className="px-5 py-2 rounded-lg bg-[var(--accent-teal)] text-[#0d0f14] font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mt-5 surface-elevated p-4">
          <div className="label-mono mb-2">Explanation</div>
          <div className="text-sm text-[var(--text-primary)] leading-relaxed">{question.explanation}</div>
        </div>
      )}
    </div>
  );
}
