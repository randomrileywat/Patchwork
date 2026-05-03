import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { buildMasteryTimeline } from '../../utils/scoring.js';

const SUBTOPIC_COLORS = {
  'audio-design':           '#f5a623',
  'video-design':           '#4a9eff',
  'signal-flow':            '#9b7dff',
  'control-systems':        '#ff6b6b',
  'networking':             '#00c9a7',
  'rack-design':            '#e879f9',
  'power-cabling':          '#fb923c',
  'documentation':          '#a3e635',
  'needs-assessment':       '#38bdf8',
  'project-implementation': '#f472b6',
};

const SUBTOPIC_LABELS = {
  'audio-design': 'Audio',
  'video-design': 'Video',
  'signal-flow': 'Signal Flow',
  'control-systems': 'Control',
  'networking': 'Networking',
  'rack-design': 'Rack',
  'power-cabling': 'Power/Cable',
  'documentation': 'Documentation',
  'needs-assessment': 'Needs Assessment',
  'project-implementation': 'Project Impl.',
};

const formatDateTick = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function CustomTooltip({ active, payload, label, hiddenLines }) {
  if (!active || !payload?.length) return null;
  const visible = payload
    .filter((p) => !hiddenLines.has(p.dataKey) && p.value != null)
    .sort((a, b) => b.value - a.value);
  return (
    <div className="rounded-lg border border-[var(--border-accent)] bg-[var(--bg-elevated)] p-3 font-mono text-[11px]">
      <div className="text-[var(--text-secondary)] mb-2">{formatDateTick(label)}</div>
      <ul className="space-y-1">
        {visible.map((p) => (
          <li key={p.dataKey} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="flex-1 text-[var(--text-primary)]">
              {p.dataKey === 'overall' ? 'Overall' : SUBTOPIC_LABELS[p.dataKey] || p.dataKey}
            </span>
            <span className="text-[var(--text-secondary)]">{p.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MasteryTrendChart({ progress }) {
  const data = useMemo(() => buildMasteryTimeline(progress), [progress]);
  const [hidden, setHidden] = useState(() => new Set());
  const [hovered, setHovered] = useState(null);

  if (!data || data.length < 2) {
    return (
      <div className="surface p-6 h-[280px] flex items-center justify-center text-[var(--text-muted)] text-sm">
        Complete sessions on 2+ days to see your mastery trends.
      </div>
    );
  }

  const subtopicKeys = Object.keys(SUBTOPIC_COLORS).filter((k) =>
    data.some((row) => row[k] != null)
  );

  const toggle = (key) => {
    if (key === 'overall') return;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className="surface p-4">
      <div className="label-mono mb-2">Mastery trends over time</div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickFormatter={formatDateTick}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--text-muted)"
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
              label={{
                value: 'Mastery %',
                angle: -90,
                position: 'insideLeft',
                offset: 14,
                style: { fontSize: 11, fontFamily: 'JetBrains Mono', fill: 'var(--text-muted)' },
              }}
            />
            <ReferenceLine
              y={80}
              stroke="var(--accent-teal)"
              strokeDasharray="4 4"
              label={{ value: 'Expert threshold', fontSize: 10, fill: 'var(--accent-teal)', position: 'right' }}
            />
            <Tooltip content={<CustomTooltip hiddenLines={hidden} />} />
            <Legend
              onClick={(o) => toggle(o.dataKey)}
              wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono', cursor: 'pointer' }}
              formatter={(value, entry) => {
                const dim = hidden.has(entry.dataKey) ? 'var(--text-muted)' : 'var(--text-primary)';
                return <span style={{ color: dim }}>{value}</span>;
              }}
            />
            <Line
              type="monotone"
              dataKey="overall"
              name="Overall"
              stroke="var(--accent-teal)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              opacity={hovered && hovered !== 'overall' ? 0.2 : 1}
              onMouseEnter={() => setHovered('overall')}
              onMouseLeave={() => setHovered(null)}
            />
            {subtopicKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={SUBTOPIC_LABELS[key] || key}
                stroke={SUBTOPIC_COLORS[key]}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
                hide={hidden.has(key)}
                opacity={hovered ? (hovered === key ? 1 : 0.2) : 0.6}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
