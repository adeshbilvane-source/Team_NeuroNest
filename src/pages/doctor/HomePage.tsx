import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Settings,
  Search,
  Calendar,
  ChevronRight,
  Users,
  MessageCircle,
  LineChart,
} from 'lucide-react'

// Placeholder data — replace with real Firebase/store data once wired.
// Flagging explicitly: none of these numbers are real yet.
const TODAY_LABEL = 'Wednesday, 26 Aug'
const CAREGIVER_NAME = '[Caregiver Name]'
const STATS = {
  appointmentsToday: 3,
  pendingRequests: 2,
  unreadMessages: 5,
}
const NEXT_APPOINTMENT = {
  patientName: '[Patient Name]',
  time: '11:00 AM',
}
const NOTIFICATION_COUNT = 3

export default function DoctorHomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      {/* Header */}
      <div className="px-6 pt-11 pb-0">
        <div className="flex items-start justify-between">
          <div className="font-bold text-ink-soft text-[13.5px]">{TODAY_LABEL}</div>
          <div className="flex gap-2.5">
            <button
              aria-label="Notifications"
              className="relative w-[42px] h-[42px] rounded-[13px] bg-white shadow-sm flex items-center justify-center"
            >
              <Bell size={20} className="text-brand-green" strokeWidth={2.2} />
              {NOTIFICATION_COUNT > 0 && (
                <span className="absolute -top-1 -right-1 w-[17px] h-[17px] rounded-full bg-alert-red text-white text-[9.5px] font-black flex items-center justify-center border-2 border-canvas">
                  {NOTIFICATION_COUNT}
                </span>
              )}
            </button>
            <button
              aria-label="Settings"
              className="w-[42px] h-[42px] rounded-[13px] bg-white shadow-sm flex items-center justify-center"
            >
              <Settings size={20} className="text-brand-green" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <h1 className="font-display italic font-semibold text-[24px] text-ink mt-4 leading-tight">
          Good Morning,
          <br />
          <span className="not-italic text-brand-green">{CAREGIVER_NAME}</span>
        </h1>

        <button
          onClick={() => navigate('/doctor/search')}
          className="mt-3.5 w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm text-left"
        >
          <Search size={19} className="text-ink-soft" strokeWidth={2.3} />
          <span className="text-[13.5px] font-bold text-ink-soft">Search patients...</span>
        </button>

        <div className="flex gap-2.5 mt-4">
          <button
            onClick={() => navigate('/doctor/appointments/today')}
            className="flex-1 bg-white rounded-2xl px-2.5 py-3 shadow-sm text-center"
          >
            <div className="text-[21px] font-black text-brand-green">{STATS.appointmentsToday}</div>
            <div className="text-[10.5px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Appointments
              <br />
              Today
            </div>
          </button>
          <button
            onClick={() => navigate('/doctor/appointments/pending')}
            className="flex-1 bg-white rounded-2xl px-2.5 py-3 shadow-sm text-center"
          >
            <div className="text-[21px] font-black text-marigold">{STATS.pendingRequests}</div>
            <div className="text-[10.5px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Pending
              <br />
              Requests
            </div>
          </button>
          <button
            onClick={() => navigate('/doctor/chat')}
            className="flex-1 bg-white rounded-2xl px-2.5 py-3 shadow-sm text-center"
          >
            <div className="text-[21px] font-black text-brand-green">{STATS.unreadMessages}</div>
            <div className="text-[10.5px] font-extrabold text-ink-soft mt-0.5 leading-tight">
              Unread
              <br />
              Messages
            </div>
          </button>
        </div>
      </div>

      {/* Next appointment banner */}
      <button
        onClick={() => navigate('/doctor/appointments/today')}
        className="mx-6 mt-4 rounded-[20px] px-4.5 py-4 flex items-center gap-3.5 text-left shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #3F6B4F 0%, #345943 100%)',
          boxShadow: '0 10px 22px rgba(63,107,79,0.35)',
        }}
      >
        <div className="w-[46px] h-[46px] rounded-2xl bg-white/[0.18] flex items-center justify-center flex-shrink-0">
          <Calendar size={24} className="text-white" strokeWidth={2.3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-extrabold tracking-wide text-[#CFE3D6] uppercase">
            Next Appointment
          </div>
          <div className="text-[15.5px] font-extrabold text-white mt-0.5 truncate">
            {NEXT_APPOINTMENT.patientName} — {NEXT_APPOINTMENT.time}
          </div>
        </div>
        <ChevronRight size={18} className="text-white flex-shrink-0" strokeWidth={2.6} />
      </button>

      {/* Manage section */}
      <div className="mt-6 px-6 text-[13px] font-black text-ink-soft uppercase tracking-wide">
        Manage
      </div>
      <div className="mt-2.5 px-6 grid grid-cols-2 gap-3.5 pb-8">
        <button
          onClick={() => navigate('/doctor/patients')}
          aria-label="Patients List"
          className="bg-brand-green-tint rounded-2xl px-3.5 py-4 flex flex-col items-start gap-5 min-h-[100px] text-left active:scale-[0.97] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-brand-green" strokeWidth={2.2} />
          </div>
          <div className="font-extrabold text-[15px] text-ink">Patients</div>
        </button>

        <button
          onClick={() => navigate('/doctor/appointments')}
          aria-label="Appointments"
          className="bg-brand-green-tint rounded-2xl px-3.5 py-4 flex flex-col items-start gap-5 min-h-[100px] text-left active:scale-[0.97] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <Calendar size={22} className="text-brand-green" strokeWidth={2.2} />
          </div>
          <div className="font-extrabold text-[15px] text-ink">Appointments</div>
        </button>

        {/* NEW: Analytics tile — was previously an orphaned route with no
            entry point on Home. Opens the flagged-first analytics hub
            across all patients. */}
        <button
          onClick={() => navigate('/doctor/analytics')}
          aria-label="Patient Analytics"
          className="bg-brand-green-tint rounded-2xl px-3.5 py-4 flex flex-col items-start gap-5 min-h-[100px] text-left active:scale-[0.97] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <LineChart size={22} className="text-brand-green" strokeWidth={2.2} />
          </div>
          <div className="font-extrabold text-[15px] text-ink">Analytics</div>
        </button>

        <button
          onClick={() => navigate('/doctor/chat')}
          aria-label="Chat with patients"
          className="col-span-2 bg-brand-green-tint rounded-2xl p-4 flex flex-row items-center gap-3.5 text-left active:scale-[0.97] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <MessageCircle size={22} className="text-brand-green" strokeWidth={2.2} />
          </div>
          <div>
            <div className="font-extrabold text-[15px] text-ink">Patient Chat</div>
            <div className="text-[11.5px] font-bold text-ink-soft mt-0.5">
              {STATS.unreadMessages} unread messages waiting
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
