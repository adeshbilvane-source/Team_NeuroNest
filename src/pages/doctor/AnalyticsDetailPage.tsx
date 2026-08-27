import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { ArrowLeft, AlertTriangle, Zap, Target, Clock, Eye, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react'

// Placeholder data — replace with real Firebase/store data once wired.
// This entire file renders ONE patient's analytics, keyed by :patientId
// from the route. Right now it always shows the same mock patient
// regardless of which ID was passed — wire this up to a real fetch
// (e.g. useEffect + Firestore query keyed on patientId) before shipping.

type Range = '7d' | '30d' | '90d'

const RANGE_LABELS: Record<Range, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
}

const SESSION_DATA = [
  { game: 'Identify the Picture', date: 'Today, 9:10 AM', rounds: 12, reactionTime: 640, missedTargets: 5 },
  { game: 'Memory Match', date: 'Yesterday, 6:40 PM', rounds: 8, reactionTime: 580, missedTargets: 3 },
  { game: 'Button Sorting', date: 'Yesterday, 11:15 AM', rounds: 15, reactionTime: 560, missedTargets: 2 },
]

const METRICS = [
  { name: 'Reaction Time', definition: 'Time from prompt shown to first correct tap', current: '612 ms', baseline: '502 ms', best: '470 ms' },
  { name: 'Missed Target', definition: 'Prompts shown with no response, or wrong tap', current: '5', baseline: '2.4', best: '21%' },
  { name: 'Current Response Time', definition: 'Reaction time from the most recent session only', current: '640 ms', baseline: '580 ms', best: '+60 ms' },
  { name: 'Attention Score', definition: 'Composite of reaction consistency + miss rate, 0-100', current: '58 / 100', baseline: '76 / 100', best: '54 / 100' },
]

function downloadFile(content: string, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function csvValue(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export default function AnalyticsDetailPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState<Range>('30d')

  // MOCK — does not yet vary by patientId or range
  const patient = {
    name: 'Sunita Rao',
    age: 68,
    flagged: true,
  }

  const exportBaseName = `${patient.name.toLowerCase().replaceAll(' ', '-')}-analytics-${range}`

  const downloadCsv = () => {
    const rows = [
      ['Patient', patient.name],
      ['Age', patient.age],
      ['Period', RANGE_LABELS[range]],
      [],
      ['Metric', 'Definition', 'Current', 'Baseline / Average', 'Best / Low'],
      ...METRICS.map((metric) => [metric.name, metric.definition, metric.current, metric.baseline, metric.best]),
      [],
      ['Game', 'Session', 'Rounds', 'Average reaction time (ms)', 'Missed targets'],
      ...SESSION_DATA.map((session) => [session.game, session.date, session.rounds, session.reactionTime, session.missedTargets]),
    ]
    downloadFile(rows.map((row) => row.map((value) => csvValue(value ?? '')).join(',')).join('\n'), `${exportBaseName}.csv`, 'text/csv;charset=utf-8')
  }

  const downloadFhir = () => {
    const report = {
      resourceType: 'DiagnosticReport',
      id: `${exportBaseName}-report`,
      status: 'final',
      code: { coding: [{ system: 'http://loinc.org', code: '8684-3', display: 'Cognitive function assessment' }] },
      subject: { reference: `Patient/${patient.name.toLowerCase().replaceAll(' ', '-')}`, display: patient.name },
      effectiveDateTime: new Date().toISOString(),
      conclusion: patient.flagged ? 'Attention flag: reaction time and missed targets have increased.' : 'No attention flag recorded.',
      contained: METRICS.map((metric, index) => ({
        resourceType: 'Observation',
        id: `${exportBaseName}-observation-${index + 1}`,
        status: 'final',
        code: { text: metric.name },
        subject: { reference: `Patient/${patient.name.toLowerCase().replaceAll(' ', '-')}` },
        valueString: metric.current,
        note: [{ text: metric.definition }],
      })),
      result: METRICS.map((_, index) => ({ reference: `#${exportBaseName}-observation-${index + 1}` })),
      extension: [{ url: 'https://neuronest.example/fhir/analytics-period', valueCode: range }],
    }
    downloadFile(JSON.stringify(report, null, 2), `${exportBaseName}.fhir.json`, 'application/fhir+json;charset=utf-8')
  }

  const downloadPdf = () => {
    const pdf = new jsPDF()
    pdf.setFontSize(20)
    pdf.text(`${patient.name} - Analytics`, 20, 20)
    pdf.setFontSize(10)
    pdf.setTextColor(91, 106, 97)
    pdf.text(`Age ${patient.age} | Reporting period: ${RANGE_LABELS[range]}`, 20, 30)
    pdf.setTextColor(36, 50, 42)
    pdf.setFontSize(13)
    pdf.text('Metric breakdown', 20, 45)
    pdf.setFontSize(10)
    METRICS.forEach((metric, index) => {
      const y = 55 + index * 18
      pdf.text(metric.name, 20, y)
      pdf.setTextColor(91, 106, 97)
      pdf.text(`${metric.definition} | Current: ${metric.current} | Baseline: ${metric.baseline} | Best/Low: ${metric.best}`, 20, y + 6)
      pdf.setTextColor(36, 50, 42)
    })
    pdf.setFontSize(13)
    pdf.text('Recent sessions', 20, 138)
    pdf.setFontSize(10)
    SESSION_DATA.forEach((session, index) => {
      pdf.text(`${session.game}: ${session.date}, ${session.rounds} rounds, ${session.reactionTime} ms avg, ${session.missedTargets} missed`, 20, 148 + index * 8)
    })
    pdf.setFontSize(9)
    pdf.setTextColor(91, 106, 97)
    pdf.text('Gameplay patterns are not a medical assessment.', 20, 180)
    pdf.save(`${exportBaseName}.pdf`)
  }

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      {/* Header */}
      <div className="px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display italic font-semibold text-[17px] text-ink truncate">
            {patient.name}
          </h1>
          <p className="text-[11px] text-ink-soft font-bold mt-0.5">Age {patient.age} · Analytics</p>
        </div>
        {patient.flagged && (
          <span className="text-[9.5px] font-black bg-red-tint text-alert-red px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            ⚠ Attention
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 pt-4 pb-8">
        {/* Range toggle */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm mb-4">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-2.5 rounded-[11px] font-extrabold text-[12.5px] transition-colors ${
                range === r ? 'bg-brand-green text-white' : 'text-ink-soft'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl px-3.5 py-3 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Download size={16} className="text-brand-green" />
            <span className="text-[12px] font-black text-ink-soft uppercase tracking-wide">Export analytics</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ExportButton icon={<FileText size={15} />} label="PDF" onClick={downloadPdf} />
            <ExportButton icon={<FileSpreadsheet size={15} />} label="CSV" onClick={downloadCsv} />
            <ExportButton icon={<FileJson size={15} />} label="FHIR JSON" onClick={downloadFhir} />
          </div>
        </div>

        {/* Attention banner */}
        {patient.flagged && (
          <div className="bg-red-tint rounded-2xl px-3.5 py-3 mb-4.5 flex gap-2.5 items-start">
            <AlertTriangle size={16} className="text-alert-red flex-shrink-0 mt-0.5" strokeWidth={2.4} />
            <p className="text-[12px] font-bold text-alert-red leading-relaxed m-0">
              Reaction time has risen 22% and missed targets have increased over the last 3 sessions.
              Consider a follow-up check.
            </p>
          </div>
        )}

        {/* Hero graph */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">
          Reaction Time — Trend
        </div>
        <div className="bg-white rounded-2xl px-4 pt-4.5 pb-3.5 shadow-sm mb-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-[12px] font-extrabold text-ink-soft uppercase tracking-wide">
                Avg. Reaction Time ({range})
              </div>
              <div className="font-display font-bold text-[26px] text-ink mt-0.5">
                612<span className="text-sm font-bold text-ink-soft"> ms</span>
              </div>
            </div>
            <span className="text-[11.5px] font-extrabold px-2.5 py-1 rounded-full bg-red-tint text-alert-red">
              ↑ 22%
            </span>
          </div>
          <div className="flex gap-3.5 my-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-[#3E7FB8]" /> This patient
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-[#C7D3C9]" /> Patient's own baseline
            </div>
          </div>
          <svg viewBox="0 0 340 120" width="100%" height="120" preserveAspectRatio="none">
            <polyline
              points="0,78 34,78 68,78 102,78 136,78 170,78 204,78 238,78 272,78 306,78 340,78"
              fill="none"
              stroke="#C7D3C9"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line x1="0" y1="20" x2="340" y2="20" stroke="#EEF1EA" strokeWidth="1" />
            <line x1="0" y1="50" x2="340" y2="50" stroke="#EEF1EA" strokeWidth="1" />
            <line x1="0" y1="80" x2="340" y2="80" stroke="#EEF1EA" strokeWidth="1" />
            <line x1="0" y1="110" x2="340" y2="110" stroke="#EEF1EA" strokeWidth="1" />
            <polyline
              points="0,85 34,82 68,75 102,78 136,68 170,60 204,55 238,45 272,38 306,28 340,22 340,120 0,120"
              fill="rgba(62,127,184,0.10)"
              stroke="none"
            />
            <polyline
              points="0,85 34,82 68,75 102,78 136,68 170,60 204,55 238,45 272,38 306,28 340,22"
              fill="none"
              stroke="#3E7FB8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="85" r="3.5" fill="#3E7FB8" />
            <circle cx="102" cy="78" r="3.5" fill="#3E7FB8" />
            <circle cx="204" cy="55" r="3.5" fill="#3E7FB8" />
            <circle cx="340" cy="22" r="4.5" fill="#3E7FB8" stroke="#fff" strokeWidth="2" />
          </svg>
          <div className="flex justify-between mt-1 px-0.5">
            <span className="text-[9.5px] text-ink-soft font-bold">Jul 27</span>
            <span className="text-[9.5px] text-ink-soft font-bold">Aug 6</span>
            <span className="text-[9.5px] text-ink-soft font-bold">Aug 16</span>
            <span className="text-[9.5px] text-ink-soft font-bold">Aug 26</span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">
          Missed Targets — Per Session
        </div>
        <div className="bg-white rounded-2xl px-4 py-4.5 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="m-0 text-[13.5px] font-extrabold text-ink">Last 8 sessions</h3>
            <span className="text-[11px] font-bold text-ink-soft">Avg: 2.4 / session</span>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-[110px] mb-1.5">
            {[
              { val: 1, h: 14, day: '18', level: 'ok' },
              { val: 2, h: 26, day: '19', level: 'ok' },
              { val: 1, h: 14, day: '21', level: 'ok' },
              { val: 3, h: 40, day: '22', level: 'miss' },
              { val: 2, h: 26, day: '23', level: 'ok' },
              { val: 4, h: 55, day: '24', level: 'high' },
              { val: 3, h: 40, day: '25', level: 'miss' },
              { val: 5, h: 70, day: '26', level: 'high' },
            ].map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="text-[9px] font-extrabold text-ink-soft mb-0.5">{b.val}</div>
                <div
                  className={`w-full max-w-[26px] rounded-t-md rounded-b-[3px] ${
                    b.level === 'high'
                      ? 'bg-red-tint'
                      : b.level === 'miss'
                        ? 'bg-marigold-tint'
                        : 'bg-brand-green-tint'
                  }`}
                  style={{ height: `${b.h}%` }}
                />
                <div className="text-[9px] font-bold text-ink-soft mt-1.5">{b.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">
          Metric Breakdown
        </div>

        <MetricCard
          icon={<Zap size={17} />}
          iconBg="bg-blue-100"
          name="Reaction Time"
          def="Time from prompt shown to first correct tap"
          stats={[
            { k: 'Current', v: '612 ms', tone: 'bad' },
            { k: 'Baseline', v: '502 ms', tone: 'neutral' },
            { k: 'Best (30d)', v: '470 ms', tone: 'good' },
          ]}
          trend={[70, 65, 55, 50, 45, 40, 38, 85]}
          trendBadIdx={[0, 1, 7]}
        />

        <MetricCard
          icon={<Target size={17} />}
          iconBg="bg-marigold-tint"
          name="Missed Target"
          def="Prompts shown with no response, or wrong tap"
          stats={[
            { k: 'This session', v: '5', tone: 'bad' },
            { k: 'Session avg', v: '2.4', tone: 'neutral' },
            { k: 'Miss rate', v: '21%', tone: 'bad' },
          ]}
          trend={[20, 35, 20, 55, 35, 75, 55, 95]}
          trendBadIdx={[3, 5, 6, 7]}
        />

        <MetricCard
          icon={<Clock size={17} />}
          iconBg="bg-brand-green-tint"
          name="Current Response Time"
          def="Reaction time from the most recent session only"
          stats={[
            { k: 'Today', v: '640 ms', tone: 'bad' },
            { k: 'Yesterday', v: '580 ms', tone: 'neutral' },
            { k: 'Change', v: '+60 ms', tone: 'bad' },
          ]}
        />

        <MetricCard
          icon={<Eye size={17} />}
          iconBg="bg-purple-100"
          name="Attention Score"
          def="Composite of reaction consistency + miss rate, 0–100"
          stats={[
            { k: 'Current', v: '58 / 100', tone: 'bad' },
            { k: 'Baseline', v: '76 / 100', tone: 'neutral' },
            { k: '30d Low', v: '54 / 100', tone: 'bad' },
          ]}
          trend={[80, 75, 60, 55, 50, 48, 45, 40]}
          trendBadIdx={[2, 3, 4, 5, 6, 7]}
          footnote="Attention Score is not a diagnosis. It's a relative indicator built from this patient's own game data, meant to flag when a conversation or check-up may be worth having — not to replace one."
        />

        {/* Session log */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mt-5.5 mb-2.5">
          Recent Sessions
        </div>
        <SessionRow icon="🖼️" title="Identify the Picture" meta="Today, 9:10 AM · 12 rounds" avg="640ms avg" missed="5 missed" bad />
        <SessionRow icon="🃏" title="Memory Match" meta="Yesterday, 6:40 PM · 8 rounds" avg="580ms avg" missed="3 missed" />
        <SessionRow icon="🔘" title="Button Sorting" meta="Yesterday, 11:15 AM · 15 rounds" avg="560ms avg" missed="2 missed" />

        <p className="text-[10.5px] text-ink-soft font-bold text-center leading-relaxed mt-4 px-1.5">
          All figures are calculated from in-app game sessions. They reflect patterns in gameplay, not a
          medical assessment — always confirm with the patient or a clinician before acting.
        </p>
      </div>
    </div>
  )
}

function ExportButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-green-tint py-2.5 text-[11px] font-black text-brand-green transition-colors hover:bg-brand-green hover:text-white"
    >
      {icon}
      {label}
    </button>
  )
}

function MetricCard({
  icon,
  iconBg,
  name,
  def,
  stats,
  trend,
  trendBadIdx = [],
  footnote,
}: {
  icon: React.ReactNode
  iconBg: string
  name: string
  def: string
  stats: { k: string; v: string; tone: 'good' | 'bad' | 'neutral' }[]
  trend?: number[]
  trendBadIdx?: number[]
  footnote?: string
}) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 mb-3 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0 text-brand-green ${iconBg}`}>
          {icon}
        </div>
        <div>
          <div className="font-extrabold text-[13.5px] text-ink">{name}</div>
          <div className="text-[10.5px] text-ink-soft font-bold mt-0.5">{def}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="bg-canvas rounded-[10px] px-1.5 py-2 text-center">
            <div className="text-[9px] uppercase tracking-wide text-ink-soft font-extrabold">{s.k}</div>
            <div
              className={`font-display text-[13.5px] font-extrabold mt-0.5 ${
                s.tone === 'bad' ? 'text-alert-red' : s.tone === 'good' ? 'text-brand-green' : 'text-ink'
              }`}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>
      {trend && (
        <div className="flex items-end gap-0.5 h-6 mt-2.5">
          {trend.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-[2px] ${
                trendBadIdx.includes(i) ? 'bg-red-tint' : 'bg-brand-green-tint'
              } ${i === trend.length - 1 ? (trendBadIdx.includes(i) ? '!bg-alert-red' : '!bg-brand-green') : ''}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      )}
      {footnote && (
        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.5 mt-2.5 text-[12px] font-bold text-[#7a5015] leading-relaxed">
          {footnote}
        </div>
      )}
    </div>
  )
}

function SessionRow({
  icon,
  title,
  meta,
  avg,
  missed,
  bad = false,
}: {
  icon: string
  title: string
  meta: string
  avg: string
  missed: string
  bad?: boolean
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-3.5 py-2.5 mb-2 shadow-sm">
      <div className="w-8 h-8 rounded-[9px] bg-brand-green-tint flex items-center justify-center text-sm flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-extrabold text-ink">{title}</div>
        <div className="text-[10.5px] text-ink-soft font-bold">{meta}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`text-[10.5px] font-extrabold ${bad ? 'text-alert-red' : 'text-ink-soft'}`}>{avg}</div>
        <div className={`text-[10.5px] font-extrabold ${bad ? 'text-alert-red' : 'text-ink-soft'}`}>{missed}</div>
      </div>
    </div>
  )
}
