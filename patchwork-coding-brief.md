# Patchwork — Full Coding Brief
**Personal CTS-D Exam Prep Tool | Dark Mode | Gamified Progress Tracking**

---

## 1. Project Overview

Patchwork is a single-user, browser-based study tool for preparing for the AVIXA CTS-D (Certified Technology Specialist – Design) exam. It supports multiple question types, tracks topic-level mastery, and uses gamification to drive practice toward weak areas. All data is stored locally — no backend, no auth.

**Target user:** One person (you). Build accordingly — no multi-user concerns, no login flows.

---

## 2. Name & Aesthetic Direction

**App name:** Patchwork

**Visual theme:** Dark mode only. Industrial-technical aesthetic — think signal path diagrams, rack schematics, oscilloscope UIs. Not "gamer dark." Clean, precise, professional.

**Font pairing:**
- Display / headings: `JetBrains Mono` or `IBM Plex Mono` (monospace with character)
- Body / UI labels: `IBM Plex Sans` or `DM Sans`
- Load both from Google Fonts

**Color palette (CSS variables):**
```css
:root {
  --bg-base:        #0d0f14;   /* near-black, page background */
  --bg-surface:     #161920;   /* card / panel surface */
  --bg-elevated:    #1e222d;   /* hover states, selected rows */
  --border:         #2a2f3d;   /* subtle dividers */
  --border-accent:  #3d4560;   /* active borders */
  --text-primary:   #e8eaf0;   /* main text */
  --text-secondary: #8b92a8;   /* labels, metadata */
  --text-muted:     #4a5068;   /* placeholders */
  --accent-teal:    #00d4a8;   /* primary CTA, correct answers, XP */
  --accent-amber:   #f5a623;   /* warnings, streak indicator */
  --accent-coral:   #ff6b6b;   /* incorrect answers, danger */
  --accent-blue:    #4a9eff;   /* info, links */
  --accent-purple:  #9b7dff;   /* flashcard mode */
  --mastery-0:      #2a2f3d;   /* Locked — no attempts */
  --mastery-1:      #5a3e2b;   /* Novice */
  --mastery-2:      #3d4a2a;   /* Developing */
  --mastery-3:      #1a4a3a;   /* Proficient */
  --mastery-4:      #00d4a8;   /* Expert */
}
```

**Motion:** Subtle only. CSS transitions at 150–200ms. Page-load stagger reveals on the dashboard. Correct answer: brief green flash + XP counter increment animation. Wrong answer: red shake. No heavy particle effects or gradients.

**No light mode.** This is dark-only. Do not implement a theme toggle.

---

## 3. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, easy build |
| Styling | Tailwind CSS v3 | Use `darkMode: 'class'` but apply `dark` class to `<html>` permanently |
| State | Zustand | Lightweight, no boilerplate |
| Charts | Recharts | Topic score bars, session history line chart |
| Routing | React Router v6 | 4 main views |
| Data | `localStorage` + JSON | All persistence local |
| Question bank | `/src/data/questions.json` | Separate file, never import inline |
| Icons | Lucide React | Consistent icon set |
| Fonts | Google Fonts (preconnect) | JetBrains Mono + IBM Plex Sans |

---

## 4. File Structure

```
patchwork/
├── public/
│   └── favicon.svg              # simple signal waveform icon
├── src/
│   ├── data/
│   │   └── questions.json       # ALL question content lives here
│   ├── store/
│   │   ├── progressStore.js     # Zustand: topic scores, XP, streaks
│   │   └── sessionStore.js      # Zustand: current session state
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx     # sidebar + main area wrapper
│   │   │   └── Sidebar.jsx      # nav links, daily streak, total XP
│   │   ├── questions/
│   │   │   ├── MultipleChoice.jsx
│   │   │   ├── Flashcard.jsx
│   │   │   ├── Scenario.jsx
│   │   │   └── DragMatch.jsx
│   │   ├── dashboard/
│   │   │   ├── TopicBar.jsx          # single topic mastery bar
│   │   │   ├── SessionChart.jsx      # Recharts line chart of session scores over time
│   │   │   ├── MasteryTrendChart.jsx # multi-line mastery % by date + overall line
│   │   │   └── StatCard.jsx          # XP, streak, questions answered
│   │   └── shared/
│   │       ├── MasteryBadge.jsx # Novice / Developing / Proficient / Expert
│   │       ├── XPToast.jsx      # animated XP popup on correct answer
│   │       └── ProgressRing.jsx # circular progress for session
│   ├── views/
│   │   ├── Dashboard.jsx        # home: topic grid, stats, recent sessions
│   │   ├── PracticeSession.jsx  # question flow + session summary
│   │   ├── WeakAreaArena.jsx    # gamified weak-topic mode
│   │   └── ReviewQueue.jsx      # missed/flagged questions
│   ├── utils/
│   │   ├── scoring.js           # XP calc, mastery level logic, buildMasteryTimeline()
│   │   ├── questionPicker.js    # weighted random selection algorithm
│   │   └── storage.js           # localStorage read/write helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind directives + CSS custom properties
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 5. CTS-D Exam Domain Structure

The question bank must be organized by these **official AVIXA exam domains** (sourced from the CTS-D Candidate Handbook). Weight your seed question count proportionally.

| Domain ID | Domain Name | Exam Weight | Target seed Qs |
|---|---|---|---|
| `domain-a` | Conducting a Needs Assessment | ~16.8% | 25 |
| `domain-b` | Coordinating with Other Professionals to Develop Project Documentation | ~23.2% | 35 |
| `domain-c` | Developing AV Designs | ~48.0% | 70 |
| `domain-d` | Conducting Project Implementation Activities | ~12.0% | 20 |

**Sub-topics within Domain C (most heavily tested — break these out as filterable sub-topics):**
- `audio-design` — Room acoustics, speaker placement, amplifier sizing, dB math
- `video-design` — Display sizing (ANSI throw ratios), aspect ratio, brightness (ANSI lumens)
- `signal-flow` — Signal path diagrams, distribution amplifiers, matrix switchers
- `control-systems` — Control system architecture, user interface design
- `networking` — AV over IP, VLAN, QoS, bandwidth calculations
- `rack-design` — Rack unit sizing, power load, heat dissipation
- `power-cabling` — Ohm's law, cable ratings, conduit fill
- `documentation` — Schematics, BOMs, as-built drawings, RFIs

---

## 6. Question Bank Schema (`questions.json`)

Every question object **must** include all of these fields:

```json
{
  "id": "ctsd-001",
  "domain": "domain-c",
  "subtopic": "audio-design",
  "type": "mc",
  "difficulty": 2,
  "question": "A conference room measures 30 ft × 20 ft × 9 ft. Using the 1/4 wavelength rule, what is the approximate lowest frequency of concern for room modes?",
  "options": [
    "A. 19 Hz",
    "B. 38 Hz",
    "C. 75 Hz",
    "D. 188 Hz"
  ],
  "correct": "B",
  "explanation": "The longest room dimension is 30 ft. Speed of sound ≈ 1,130 ft/s. Room mode frequency = 1130 / (2 × 30) ≈ 18.8 Hz for the fundamental axial mode. The 1/4 wavelength concern starts at ~38 Hz for practical room treatment purposes.",
  "tags": ["acoustics", "room modes", "math"],
  "source": "AVIXA CTS-D Exam Guide / public practice resources"
}
```

**Type values:**
- `"mc"` — multiple choice, single correct answer (A/B/C/D)
- `"mc-multi"` — multiple choice, 2+ correct answers (check all that apply)
- `"flashcard"` — front/back flip card
- `"scenario"` — longer situational prompt, single best answer
- `"drag-match"` — pairs of terms to match (left column → right column)

**Difficulty scale:** 1 (recall) → 2 (apply) → 3 (analyze/evaluate)

**Flashcard schema (different from MC):**
```json
{
  "id": "ctsd-flash-001",
  "domain": "domain-c",
  "subtopic": "video-design",
  "type": "flashcard",
  "difficulty": 1,
  "front": "ANSI/AVIXA 2M-2010",
  "back": "The AVIXA standard for audiovisual systems performance verification. Defines minimum performance levels for AV systems in various room types.",
  "tags": ["standards", "AVIXA"],
  "source": "AVIXA standards library"
}
```

**Drag-match schema:**
```json
{
  "id": "ctsd-drag-001",
  "domain": "domain-b",
  "subtopic": "documentation",
  "type": "drag-match",
  "difficulty": 2,
  "question": "Match each document type to its correct description.",
  "pairs": [
    { "term": "RFI", "definition": "Request for Information — used to clarify design intent during construction" },
    { "term": "BOQ", "definition": "Bill of Quantities — itemized list of materials and quantities" },
    { "term": "Shop Drawing", "definition": "Fabrication-ready drawing produced by the contractor for approval" },
    { "term": "As-Built Drawing", "definition": "Final drawing set reflecting actual installed conditions" }
  ],
  "tags": ["documentation", "project management"],
  "source": "AVIXA CTS-D Exam Guide"
}
```

---

## 7. Seed Question Bank

Populate `questions.json` with at least **150 seed questions** distributed across all domains. Source questions from:

1. **AVIXA's free official sample questions** at `avixa.org/certification-section/cts-d/exam-prep` (publicly available, clearly labeled as sample questions)
2. **Udemy CTS-D prep courses** (paraphrase and rewrite in your own words — do not copy verbatim)
3. **EDUSUM CTS-D sample question sets** at `edusum.com/avixa/avixa-cts-d-certification-sample-questions`
4. **Original AV math questions** you write from first principles using AVIXA formulas

**Required topic coverage for seed bank:**

| Subtopic | Min questions |
|---|---|
| audio-design | 20 |
| video-design | 18 |
| signal-flow | 18 |
| control-systems | 12 |
| networking | 12 |
| rack-design | 10 |
| power-cabling | 10 |
| documentation | 15 |
| needs-assessment (domain-a) | 20 |
| project-implementation (domain-d) | 15 |

Include at least **15 flashcards**, **10 scenario questions**, and **5 drag-match sets** in the 150 total.

---

## 8. Core Logic

### 8a. Mastery Level System

Each topic tracks a **rolling accuracy score** over the last 20 attempts (or all attempts if fewer than 20).

```
Mastery Level:
  0% – 39%  → Novice      (icon: single bar, color: --mastery-1)
  40% – 59% → Developing  (icon: two bars, color: --mastery-2)
  60% – 79% → Proficient  (icon: three bars, color: --mastery-3)
  80%+      → Expert      (icon: four bars, color: --mastery-4)
  No attempts → Locked    (icon: lock, color: --mastery-0)
```

Store per-topic in `progressStore`:
```js
{
  topicId: "audio-design",
  attempts: [...{ questionId, correct, timestamp }],
  masteryLevel: 2,      // computed from rolling score
  rollingScore: 0.61,   // last 20 attempts accuracy
  xpEarned: 340
}
```

### 8b. XP System

| Event | XP |
|---|---|
| Correct answer (difficulty 1) | +10 XP |
| Correct answer (difficulty 2) | +20 XP |
| Correct answer (difficulty 3) | +35 XP |
| Correct in Weak Area Arena | +1.5× multiplier |
| Mastery level up | +100 XP bonus |
| Daily streak maintained | +50 XP |
| Session completed (10+ questions) | +25 XP |

XP is cumulative and never decreases. Display in sidebar always.

### 8c. Weak Area Arena — Question Picker Algorithm

Located in `utils/questionPicker.js`. This is the core gamification engine.

```
1. Get all topics with at least 5 attempts.
2. Sort by rollingScore ascending.
3. Take the bottom 3 topics (or fewer if not enough data).
4. Build a weighted pool:
   - Bottom topic: 50% of questions from this topic
   - 2nd weakest: 30%
   - 3rd weakest: 20%
5. Within each topic, weight toward difficulty 2 and 3 questions.
6. Never repeat a question seen in the last 10 picks.
7. If fewer than 3 topics have 5+ attempts, fill remaining slots with random unseen questions.
```

### 8d. Daily Streak

- A "day" is a calendar day in local timezone.
- Streak increments if at least 1 session (5+ questions) is completed per day.
- Streak breaks if a full calendar day passes with no session.
- Store: `{ currentStreak: N, longestStreak: N, lastSessionDate: "YYYY-MM-DD" }`
- Display in sidebar with a fire icon and amber color when streak > 0.

---

## 9. Views

### 9a. Dashboard (`/`)

**Layout:** Sidebar (fixed) + main scrollable content area.

**Main content sections:**
1. **Header bar** — "Good [morning/afternoon/evening], [no name needed]" + today's date
2. **Stat row** — 4 StatCards: Total XP / Questions Answered / Current Streak / Sessions This Week
3. **Topic mastery grid** — one row per domain, expandable to show sub-topics. Each row shows: domain name, mastery badge, rolling score %, a horizontal bar colored by mastery level.
4. **Session history chart** — Recharts `LineChart` showing score % per session over time (last 20 sessions). X-axis: session number or date. Y-axis: 0–100%.

5. **Mastery over time chart** — A second `LineChart` below the session history chart, showing how mastery percentage has trended across calendar dates.

   - **X-axis:** Date (`YYYY-MM-DD`), formatted as `MMM D` (e.g. "May 3"). Use Recharts `XAxis` with `dataKey="date"` and a `tickFormatter` that parses and formats the date string.
   - **Y-axis:** 0–100%, labeled "Mastery %". Use a `ReferenceLine` at y=80 with a dashed teal stroke and label "Expert threshold".
   - **Lines:**
     - One **Overall** line — computed as the average rolling score across all topics with at least 1 attempt. Stroke: `--accent-teal`, strokeWidth: 2.5, always rendered on top.
     - One line per **sub-topic** (audio-design, video-design, signal-flow, etc.) — each sub-topic gets a distinct color from this fixed mapping:

       ```js
       const SUBTOPIC_COLORS = {
         "audio-design":          "#f5a623",  // amber
         "video-design":          "#4a9eff",  // blue
         "signal-flow":           "#9b7dff",  // purple
         "control-systems":       "#ff6b6b",  // coral
         "networking":            "#00c9a7",  // teal-green
         "rack-design":           "#e879f9",  // pink
         "power-cabling":         "#fb923c",  // orange
         "documentation":         "#a3e635",  // lime
         "needs-assessment":      "#38bdf8",  // sky
         "project-implementation":"#f472b6",  // rose
       };
       ```

     - Sub-topic lines: strokeWidth 1.5, strokeDasharray none, default opacity 0.6.
   - **Interactivity:**
     - Recharts `<Legend>` below the chart. Clicking a legend item toggles that line's visibility (use local `hiddenLines` state — a `Set` of subtopic IDs). The Overall line cannot be hidden.
     - Recharts `<Tooltip>` — custom tooltip component that shows the date as a header, then lists each visible line's name and value sorted descending by mastery %, with a colored dot matching the line color. Format values as `"61%"`.
     - On hover, non-hovered lines drop to opacity 0.2 (use `onMouseEnter`/`onMouseLeave` on each `<Line>`).
   - **Data shape** — computed in `utils/scoring.js` as `buildMasteryTimeline()`:

     ```js
     // Returns an array of daily snapshots, one object per day that had any session activity.
     // Each object: { date: "2026-05-01", overall: 64, "audio-design": 72, "video-design": 58, ... }
     // For days with no activity for a given subtopic, carry forward the last known value (no gaps in lines).
     // If a subtopic has never been attempted by a given date, omit that key (line starts where data begins).
     buildMasteryTimeline(progressStore) => DailySnapshot[]
     ```

   - **Empty state:** If fewer than 2 days of data exist, render a placeholder card with the text: `"Complete sessions on 2+ days to see your mastery trends."` in `--text-muted` color, same card dimensions as the chart.
   - **Chart dimensions:** Height 280px, full container width, `margin={{ top: 8, right: 24, bottom: 8, left: 0 }}`.
   - **Background:** Same `--bg-surface` card as the session history chart. Add a section label above it: `"Mastery trends over time"` in `--text-secondary` at 11px uppercase.
5. **Review queue teaser** — count of flagged/missed questions with a "Go to Review Queue →" link.

### 9b. Practice Session (`/practice`)

**Pre-session config panel:**
- Topic filter: All / Domain A / Domain B / Domain C (with sub-topic checkboxes) / Domain D
- Question types: toggle checkboxes for MC, Flashcard, Scenario, Drag-Match
- Question count: slider 5 / 10 / 20 / 30
- Difficulty filter: All / 1 only / 2 only / 3 only / 2+3 only

**During session:**
- Progress ring (top right) showing X/N complete
- Question card (centered, max-width 700px)
- For MC: 4 option buttons. On select: immediate feedback (green correct / red incorrect + shake). Show explanation below before moving to next.
- For flashcard: flip animation on click. Rate yourself: "Got it" / "Missed it" buttons after flip.
- For scenario: same as MC but with a longer prompt block styled differently (slightly inset, monospace font for technical specs).
- For drag-match: two columns. Left column items are draggable. Drop onto right column targets. Submit button reveals results.
- "Flag this question" icon button — adds to review queue.
- "Skip" button — moves on, marks as skipped (not counted in score).

**Session summary screen (after last question):**
- Score: X / N correct (large, colored by score: coral <60%, amber 60–79%, teal 80%+)
- XP earned this session (animated count-up)
- Topic breakdown: which topics were covered, score per topic
- Mastery changes: any topics that leveled up (highlighted with level-up badge)
- Buttons: "Practice Again" / "Go to Weak Area Arena" / "Back to Dashboard"

### 9c. Weak Area Arena (`/arena`)

Visual differentiation from standard practice — use `--accent-amber` accents instead of teal. Show a banner: "Targeting your 3 weakest topics."

Display which 3 topics are targeted (with current mastery level) before starting.

Same question flow as Practice Session but:
- XP multiplier shown in session header: "1.5× XP Active"
- On mastery level up during arena: special animation + "BREAKTHROUGH" text flash

Session length: 20 questions, fixed. No config panel.

### 9d. Review Queue (`/review`)

List of all flagged or previously incorrect questions. Sortable by: domain / date added / difficulty.

Each row shows:
- Question text (truncated to 1 line)
- Domain + subtopic tag
- Difficulty badge
- "Attempt" button → launches single-question practice flow inline
- "Remove" button → removes from queue

On correct attempt: question fades out of queue with a green flash.

---

## 10. Sidebar (Always Visible)

```
[Patchwork logo — stylized waveform SVG]

NAVIGATION
  Dashboard
  Practice
  Weak Area Arena
  Review Queue   [badge: N]

────────────────

STREAK
  🔥 7 days

TOTAL XP
  2,840 XP

────────────────
[small version/build text at bottom]
```

---

## 11. localStorage Schema

All keys prefixed with `patchwork_`:

| Key | Value |
|---|---|
| `patchwork_progress` | JSON: per-topic attempt history + mastery levels |
| `patchwork_sessions` | JSON: array of past session summaries |
| `patchwork_xp` | JSON: `{ total, streak, lastSessionDate, longestStreak }` |
| `patchwork_review_queue` | JSON: array of `{ questionId, addedAt, attempts }` |
| `patchwork_settings` | JSON: any future user preferences |

Write to localStorage on every state change via Zustand middleware (`persist`). Use `zustand/middleware`'s built-in `persist` with `localStorage` as the storage engine.

---

## 12. Styling Guidelines for the Agent

- Apply `class="dark"` permanently to the `<html>` element in `index.html`.
- In `tailwind.config.js` set `darkMode: 'class'`.
- Use Tailwind's dark: prefix variants plus the CSS custom properties defined in Section 2.
- All cards: `bg-[--bg-surface] border border-[--border] rounded-xl`.
- Correct answer feedback: add `ring-2 ring-[--accent-teal]` + brief `bg-teal-900/30` background.
- Incorrect answer feedback: add `ring-2 ring-[--accent-coral]` + `animate-shake` (define a 3-step translate keyframe).
- XP toast: absolute positioned, animates upward and fades out over 1.2s.
- Mastery bars: `<div>` with `transition-all duration-700` so width animates on score update.
- Flashcard flip: CSS `perspective` + `rotateY(180deg)` transform on `[data-flipped="true"]`.

---

## 13. Phase 2 Extensions (Implement hooks but leave inactive)

Leave the following as clearly commented stubs so Phase 2 is easy to wire up:

1. **Claude API integration** — A `utils/aiQuestionGenerator.js` stub that accepts `{ topic, difficulty, count }` and returns questions in the standard schema format. Comment: `// Phase 2: call Anthropic /v1/messages with a question-generation prompt`.

2. **CCNA domain toggle** — In `questions.json`, include a top-level `"certification"` field on each question (`"CTS-D"` for all seed questions). In the domain filter UI, stub a disabled `<select>` for certification with values `["CTS-D", "CCNA (coming soon)"]`.

3. **Export** — A `utils/exportData.js` stub with a `exportProgress()` function that serializes all localStorage keys to a downloadable JSON blob.

---

## 14. Build & Run

```bash
npm create vite@latest patchwork -- --template react
cd patchwork
npm install tailwindcss @tailwindcss/vite zustand recharts lucide-react react-router-dom
npx tailwindcss init -p
npm run dev
```

Production build: `npm run build` → deploy `/dist` as a static site (Netlify, Vercel, or GitHub Pages all work).

---

## 15. Definition of Done (Phase 1)

- [ ] All 4 views route correctly
- [ ] Practice session works for all 4 question types
- [ ] XP increments and persists across page reloads
- [ ] Topic mastery levels compute correctly from attempt history
- [ ] Weak area arena correctly weights bottom 3 topics
- [ ] Review queue adds flagged questions and allows re-attempt
- [ ] Daily streak logic is correct across timezone midnight boundary
- [ ] 150+ seed questions loaded from `questions.json`
- [ ] All seed questions include an explanation field
- [ ] Dark theme only, no flash of light on load
- [ ] Session summary screen shows per-topic breakdown
- [ ] Recharts session history chart renders with real data
- [ ] Mastery trend chart renders with one Overall line + one line per sub-topic
- [ ] Mastery trend chart legend toggles individual sub-topic lines on/off
- [ ] `buildMasteryTimeline()` correctly carries forward last known value for days with no activity
- [ ] Mastery trend chart shows empty state when fewer than 2 days of data exist
- [ ] localStorage persists and restores correctly after hard refresh
- [ ] No hardcoded question content in component files (all from JSON)

---

*Brief version: 1.0 | Prepared: May 2026 | Exam target: AVIXA CTS-D*
