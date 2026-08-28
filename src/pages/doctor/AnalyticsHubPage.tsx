import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, AlertTriangle } from 'lucide-react'
import PatientAvatar from '../../components/PatientAvatar'

// Placeholder data — replace with real Firebase/store data once wired.
// "Attention" flags and trend sparklines are computed server-side once
// real game-session data exists; these are illustrative only.
type PatientTrend = {
  id: string
  name: string
  initials: string
  status: 'attention' | 'stable'
  trendLabel: string
  trendDirection: 'up' | 'down' | 'flat'
  sparkline: number[] // 0–100 heights
}

const FLAGGED: PatientTrend[] = [
  {
    id: 'sunita-rao',
    name: 'Sunita Rao',
    initials: 'SR',
    status: 'attention',
    trendLabel: 'Reaction time up 22% · 3 missed targets',
    trendDirection: 'down',
    sparkline: [60, 45, 70, 35, 20],
  },
  {
    id: 'manoj-joshi',
    name: 'Manoj Joshi',
    initials: 'MJ',
    status: 'attention',
    trendLabel: 'Attention score down 15%',
    trendDirection: 'down',
    sparkline: [80, 60, 50, 40, 25],
  },
]

const ALL_PATIENTS: PatientTrend[] = [
  {
    id: 'ramesh-kulkarni',
    name: 'Ramesh Kulkarni',
    initials: 'RK',
    status: 'stable',
    trendLabel: 'Reaction time improving',
    trendDirection: 'up',
    sparkline: [30, 45, 55, 70, 85],
  },
  {
    id: 'vikram-patil',
    name: 'Vikram Patil',
    initials: 'VP',
    status: 'stable',
    trendLabel: 'No significant change',
    trendDirection: 'flat',
    sparkline: [55, 60, 50, 58, 55],
  },
  {
    id: 'anjali-deshmukh',
    name: 'Anjali Deshmukh',
    initials: 'AD',
    status: 'stable',
    trendLabel: 'Missed targets down',
    trendDirection: 'up',
    sparkline: [35, 50, 60, 65, 80],
  },
]

const SUMMARY = {
  trackedPatients: 12,
  needAttention: FLAGGED.length,
  dataWindow: '7d',
}

function TrendRow({ trend, label }: { trend: PatientTrend['trendDirection']; label: string }) {
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const color = trend === 'up' ? 'text-brand-green' : trend === 'down' ? 'text-alert-red' : 'text-ink-soft'
  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${color}`}>
      {arrow} {label}
    </div>
  )
}

function Sparkline({ values, flagged }: { values: number[]; flagged: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5 flex-shrink-0">
      {values.map((h, i) => {
        const isLast = i === values.length - 1
        const barColor = isLast
          ? flagged
            ? 'bg-alert-red'
            : 'bg-brand-green'
          : flagged
            ? 'bg-red-tint'
            : 'bg-brand-green-tint'
        return (
          <div
            key={i}
            className={`w-1 rounded-t-[2px] ${barColor}`}
            style={{ height: `${h}%`, backgroundColor: undefined }}
          />
        )
      })}
    </div>
  )
}

function PatientCard({ patient, onClick }: { patient: PatientTrend; onClick: () => void }) {
  const flagged = patient.status === 'attention'
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-2xl p-3.5 mb-2.5 flex items-center gap-3.5 shadow-sm text-left ${
        flagged ? 'border-[1.5px] border-red-tint' : 'border-[1.5px] border-transparent'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0 ${
          flagged ? 'bg-alert-red' : 'bg-[#9AA69C]'
        }`}
      >
        <PatientAvatar patientId={patient.id} initials={patient.initials} name={patient.name} className="w-full h-full rounded-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-[14.5px] text-ink mb-0.5">{patient.name}</h4>
        <TrendRow trend={patient.trendDirection} label={patient.trendLabel} />
      </div>
      <Sparkline values={patient.sparkline} flagged={flagged} />
      <span
        className={`text-[9.5px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
          flagged ? 'bg-red-tint text-alert-red' : 'bg-brand-green-tint text-brand-green'
        }`}
      >
        {flagged ? 'Attention' : 'Stable'}
      </span>
    </button>
  )
}

export default function AnalyticsHubPage() {
  const navigate = useNavigate()

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
        <h1 className="font-display italic font-semibold text-xl text-ink">Analytics</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        {/* Search */}
        <button
          onClick={() => navigate('/doctor/search')}
          className="w-full bg-white rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm mb-4.5 text-left"
        >
          <Search size={18} className="text-ink-soft flex-shrink-0" strokeWidth={2.3} />
          <span className="text-[13px] font-bold text-ink-soft">Search patients...</span>
        </button>

        {/* Summary strip */}
        <div className="flex gap-2.5 mb-5">
          <div className="flex-1 bg-white rounded-2xl px-2.5 py-3 text-center shadow-sm">
            <div className="font-display font-bold text-xl text-ink">{SUMMARY.trackedPatients}</div>
            <div className="text-[10px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Tracked
              <br />
              Patients
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl px-2.5 py-3 text-center shadow-sm">
            <div className="font-display font-bold text-xl text-alert-red">{SUMMARY.needAttention}</div>
            <div className="text-[10px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Need
              <br />
              Attention
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl px-2.5 py-3 text-center shadow-sm">
            <div className="font-display font-bold text-xl text-ink">{SUMMARY.dataWindow}</div>
            <div className="text-[10px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Data
              <br />
              Window
            </div>
          </div>
        </div>

        {FLAGGED.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 text-[12px] font-black text-alert-red uppercase tracking-wide mb-2.5">
              <AlertTriangle size={13} strokeWidth={2.6} />
              Needs Attention
            </div>
            <div className="bg-red-tint rounded-2xl px-3.5 py-2.5 mb-3 text-[11.5px] font-bold text-alert-red leading-relaxed">
              {FLAGGED.length} patients show a declining trend across two or more sessions. Reviewing
              sooner rather than later is recommended.
            </div>
            {FLAGGED.map((p) => (
              <PatientCard key={p.id} patient={p} onClick={() => navigate(`/doctor/analytics/${p.id}`)} />
            ))}
          </>
        )}

        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mt-5.5 mb-2.5">
          All Patients
        </div>
        {ALL_PATIENTS.map((p) => (
          <PatientCard key={p.id} patient={p} onClick={() => navigate(`/doctor/analytics/${p.id}`)} />
        ))}

        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.5 mt-2.5 text-[12px] font-bold text-[#7a5015] leading-relaxed">
          Trends are calculated from in-app game sessions (Memory Match, Identify the Picture, and
          others). A patient needs at least 3 recent sessions before a trend is shown. Tap any patient
          to see their full breakdown.
        </div>
      </div>
    </div>
  )
}
