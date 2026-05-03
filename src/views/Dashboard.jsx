import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore.js';
import questions from '../data/questions.json';
import StatCard from '../components/dashboard/StatCard.jsx';
import TopicBar from '../components/dashboard/TopicBar.jsx';
import SessionChart from '../components/dashboard/SessionChart.jsx';
import MasteryTrendChart from '../components/dashboard/MasteryTrendChart.jsx';
import { computeRollingScore, masteryLevelFromScore, greetingForNow, formatDateLong } from '../utils/scoring.js';
import { todayISO } from '../utils/storage.js';

const DOMAIN_META = {
  'domain-a': { name: 'A · Needs Assessment', subtopics: ['needs-assessment'] },
  'domain-b': { name: 'B · Project Documentation', subtopics: ['documentation'] },
  'domain-c': { name: 'C · AV Design', subtopics: ['audio-design', 'video-design', 'signal-flow', 'control-systems', 'networking', 'rack-design', 'power-cabling'] },
  'domain-d': { name: 'D · Project Implementation', subtopics: ['project-implementation'] },
};

const SUBTOPIC_LABEL = {
  'audio-design': 'Audio Design',
  'video-design': 'Video Design',
  'signal-flow': 'Signal Flow',
  'control-systems': 'Control Systems',
  'networking': 'Networking',
  'rack-design': 'Rack Design',
  'power-cabling': 'Power & Cabling',
  'documentation': 'Documentation',
  'needs-assessment': 'Needs Assessment',
  'project-implementation': 'Project Implementation',
};

export default function Dashboard() {
  const progress = useProgressStore();
  const [expanded, setExpanded] = useState({ 'domain-c': true });

  const stats = useMemo(() => {
    const allAttempts = Object.values(progress.topics).flatMap((t) => t.attempts || []);
    const today = todayISO();
    const sessionsThisWeek = (progress.sessions || []).filter((s) => {
      if (!s.date) return false;
      const d = new Date(s.date + 'T00:00:00');
      const now = new Date(today + 'T00:00:00');
      return (now - d) / (1000 * 60 * 60 * 24) <= 7;
    }).length;
    return {
      totalQuestionsAnswered: allAttempts.length,
      sessionsThisWeek,
    };
  }, [progress.topics, progress.sessions]);

  const topicSummary = (subtopic) => {
    const t = progress.topics[subtopic];
    const attempts = t?.attempts || [];
    const score = computeRollingScore(attempts) ?? 0;
    const level = masteryLevelFromScore(score, attempts.length).level;
    return { score, level, attempts: attempts.length };
  };

  const domainSummary = (domainId) => {
    const subtopics = DOMAIN_META[domainId].subtopics;
    let totalAttempts = 0;
    let weightedScore = 0;
    let count = 0;
    subtopics.forEach((st) => {
      const s = topicSummary(st);
      totalAttempts += s.attempts;
      if (s.attempts > 0) {
        weightedScore += s.score;
        count += 1;
      }
    });
    const avg = count > 0 ? weightedScore / count : 0;
    const level = masteryLevelFromScore(avg, totalAttempts).level;
    return { score: avg, level, attempts: totalAttempts };
  };

  return (
    <div className="space-y-7">
      <header>
        <div className="text-2xl text-[var(--text-primary)]">{greetingForNow()}</div>
        <div className="text-sm text-[var(--text-secondary)] mt-1">{formatDateLong()}</div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total XP" value={`${progress.totalXP.toLocaleString()}`} accent="teal" />
        <StatCard label="Questions Answered" value={stats.totalQuestionsAnswered} accent="blue" />
        <StatCard label="Current Streak" value={`${progress.currentStreak} ${progress.currentStreak === 1 ? 'day' : 'days'}`} hint={`Longest: ${progress.longestStreak}`} accent="amber" />
        <StatCard label="Sessions This Week" value={stats.sessionsThisWeek} accent="purple" />
      </div>

      <section className="surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="label-mono">Topic mastery</div>
          <div className="text-[11px] font-mono text-[var(--text-muted)]">
            {questions.length} questions in bank
          </div>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {Object.entries(DOMAIN_META).map(([domainId, meta]) => {
            const ds = domainSummary(domainId);
            const isOpen = !!expanded[domainId];
            return (
              <div key={domainId} className="py-1">
                <div
                  className="flex items-center cursor-pointer select-none py-1"
                  onClick={() => setExpanded((e) => ({ ...e, [domainId]: !isOpen }))}
                >
                  {isOpen ? <ChevronDown size={14} className="text-[var(--text-secondary)] mr-1" /> : <ChevronRight size={14} className="text-[var(--text-secondary)] mr-1" />}
                  <div className="flex-1">
                    <TopicBar name={meta.name} score={ds.score} attempts={ds.attempts} level={ds.level} />
                  </div>
                </div>
                {isOpen && (
                  <div className="ml-6 border-l border-[var(--border)] pl-4">
                    {meta.subtopics.map((st) => {
                      const s = topicSummary(st);
                      return <TopicBar key={st} name={SUBTOPIC_LABEL[st] || st} score={s.score} attempts={s.attempts} level={s.level} />;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <SessionChart sessions={progress.sessions} />

      <MasteryTrendChart progress={progress} />

      <div className="surface p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark size={18} className="text-[var(--accent-coral)]" />
          <div>
            <div className="text-sm text-[var(--text-primary)]">Review queue</div>
            <div className="text-xs text-[var(--text-secondary)]">
              {progress.reviewQueue.length} flagged or missed {progress.reviewQueue.length === 1 ? 'question' : 'questions'}
            </div>
          </div>
        </div>
        <Link to="/review" className="text-sm font-mono text-[var(--accent-teal)] hover:underline">
          Go to Review Queue →
        </Link>
      </div>
    </div>
  );
}
