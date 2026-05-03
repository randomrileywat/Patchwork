import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function SessionChart({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="surface p-6 text-[var(--text-muted)] text-sm h-[260px] flex items-center justify-center">
        Complete a session to see session score history.
      </div>
    );
  }
  const data = sessions.slice(-20).map((s, i) => ({
    name: `#${sessions.length - Math.min(20, sessions.length) + i + 1}`,
    pct: s.pct,
    date: s.date,
  }));
  return (
    <div className="surface p-4">
      <div className="label-mono mb-2">Session score history</div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-accent)',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--text-secondary)' }}
              formatter={(v) => [`${v}%`, 'Score']}
            />
            <Line type="monotone" dataKey="pct" stroke="var(--accent-teal)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
