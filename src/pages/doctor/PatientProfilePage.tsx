import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Calendar, LineChart } from 'lucide-react'

// Placeholder data — replace with real Firebase/store data once wired.
// Does not yet vary by patientId.
export default function PatientProfilePage() {
  const navigate = useNavigate()
  const { patientId } = useParams<{ patientId: string }>()

  const patient = {
    initials: 'RK',
    name: 'Ramesh Kulkarni',
    meta: 'Male · Diabetic, Osteoarthritis',
    age: '74 yrs',
    birthdate: '14 Mar 1952',
    bloodType: 'O+',
    contact: '+91 98xxxxx210',
    vitals: [
      { label: '🩸 Blood glucose (avg)', value: '142 mg/dL', warn: false },
      { label: '❤️ Blood pressure (avg)', value: '138/88', warn: true },
      { label: '🚶 Mobility check-ins', value: '5 / 7 days', warn: false },
    ],
    note: {
      text: 'BP trending high this week — recommend reviewing medication dosage at today\u2019s visit.',
      date: 'Added 26 Aug',
    },
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
        <h1 className="font-display italic font-semibold text-xl text-ink">Patient Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        {/* Profile hero */}
        <div className="bg-white rounded-[22px] px-5.5 py-5.5 text-center shadow-sm mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center font-extrabold text-[22px] mx-auto mb-2.5">
            {patient.initials}
          </div>
          <h2 className="font-display italic font-semibold text-[19px] text-ink m-0">{patient.name}</h2>
          <p className="text-[12.5px] font-bold text-ink-soft mt-1">{patient.meta}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4.5">
          <InfoBox k="Age" v={patient.age} />
          <InfoBox k="Birthdate" v={patient.birthdate} />
          <InfoBox k="Blood Type" v={patient.bloodType} />
          <InfoBox k="Contact" v={patient.contact} small />
        </div>

        {/* Analytics entry point — NEW.
            Analytics is patient-owned data reviewed by the caregiver,
            not a separate top-level concept — this is the primary way
            a caregiver reaches one patient's full breakdown. Home's
            Analytics tile opens the flagged-first hub across everyone;
            this jumps straight to this one patient. */}
        <button
          onClick={() => navigate(`/doctor/analytics/${patientId ?? patient.initials}`)}
          className="w-full bg-white rounded-2xl px-4 py-3.5 mb-4.5 flex items-center gap-3 shadow-sm text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0">
            <LineChart size={19} className="text-brand-green" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[14px] text-ink">View Analytics</div>
            <div className="text-[11px] text-ink-soft font-bold mt-0.5">
              Reaction time, missed targets, attention trend
            </div>
          </div>
          <span className="text-ink-soft text-lg">›</span>
        </button>

        {/* Vitals / recent analytics summary */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">
          Analytics — last 7 days
        </div>
        {patient.vitals.map((v, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white rounded-2xl px-3.5 py-3 mb-2.5 shadow-sm"
          >
            <div className="text-[12px] text-ink-soft font-bold">{v.label}</div>
            <div className={`font-display font-extrabold text-[14.5px] ${v.warn ? 'text-alert-red' : 'text-ink'}`}>
              {v.value}
            </div>
          </div>
        ))}

        {/* Care notes */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mt-4 mb-2.5">
          Care notes
        </div>
        <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm mb-4.5">
          <p className="m-0 text-[13px] text-ink font-bold leading-relaxed">{patient.note.text}</p>
          <div className="text-[11px] text-ink-soft font-bold mt-1.5">{patient.note.date}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('/doctor/chat')}
            className="flex-1 bg-brand-green text-white rounded-2xl py-3.5 font-extrabold text-[13.5px] flex items-center justify-center gap-1.5"
          >
            <MessageCircle size={16} strokeWidth={2.4} /> Message
          </button>
          <button
            onClick={() => navigate('/doctor/appointments')}
            className="flex-1 bg-white text-ink rounded-2xl py-3.5 font-extrabold text-[13.5px] shadow-sm flex items-center justify-center gap-1.5"
          >
            <Calendar size={16} strokeWidth={2.4} /> Schedule Visit
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ k, v, small = false }: { k: string; v: string; small?: boolean }) {
  return (
    <div className="bg-white rounded-[14px] px-3.5 py-3 shadow-sm">
      <div className="text-[10px] uppercase tracking-wide text-ink-soft font-extrabold">{k}</div>
      <div className={`font-display font-extrabold text-ink mt-0.5 ${small ? 'text-[12.5px]' : 'text-[14px]'}`}>
        {v}
      </div>
    </div>
  )
}
