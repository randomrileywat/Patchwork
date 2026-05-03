import MultipleChoice from './MultipleChoice.jsx';

// Scenarios are MC questions with a longer prompt rendered in a distinct, monospace block.
export default function Scenario({ question, onAnswered }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[var(--accent-blue)] font-mono mb-3">
        Scenario
      </div>
      <div className="surface-elevated p-5 mb-5 font-mono text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">
        {question.scenario || ''}
      </div>
      <MultipleChoice question={question} onAnswered={onAnswered} />
    </div>
  );
}
