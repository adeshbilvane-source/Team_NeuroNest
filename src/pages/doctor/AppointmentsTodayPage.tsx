import { ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Appointment = {
  id: string
  time: string
  period: string
  initials: string
  name: string
  detail: string
  status: 'Confirmed' | 'Done'
}

const appointments: Appointment[] = [
  { id: 'ramesh-kulkarni', time: '11:00', period: 'AM', initials: 'RK', name: 'Ramesh Kulkarni', detail: 'Routine checkup · Home visit', status: 'Confirmed' },
  { id: 'vikram-patil', time: '3:00', period: 'PM', initials: 'VP', name: 'Vikram Patil', detail: 'Follow-up · Clinic', status: 'Confirmed' },
  { id: 'anjali-deshmukh', time: '5:30', period: 'PM', initials: 'AD', name: 'Anjali Deshmukh', detail: 'Medication review · Video call', status: 'Confirmed' },
]

const completedAppointment: Appointment = {
  id: 'manoj-joshi',
  time: '9:00',
  period: 'AM',
  initials: 'MJ',
  name: 'Manoj Joshi',
  detail: 'New patient intake',
  status: 'Done',
}

export default function AppointmentsTodayPage() {
  const navigate = useNavigate()

  const openAppointment = (id: string) => navigate(`/doctor/appointments/${id}`)

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} />
        </button>
        <h1 className="font-display italic font-semibold text-xl text-ink">Appointments Today</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <div className="inline-block bg-brand-green-tint text-brand-green font-extrabold text-xs px-3.5 py-1.5 rounded-full mb-4">
          Wednesday, 26 Aug · 3 today
        </div>

        <button onClick={() => openAppointment('ramesh-kulkarni')} className="w-full bg-gradient-to-br from-brand-green to-[#345943] rounded-[20px] p-4 flex items-center gap-3.5 shadow-lg mb-5.5 text-left">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-white/[0.18] flex items-center justify-center flex-shrink-0">
            <CalendarDays size={24} className="text-white" strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-extrabold tracking-wide text-[#CFE3D6] uppercase">Up Next · 11:00 AM</div>
            <div className="text-[15px] font-extrabold text-white mt-0.5 truncate">Ramesh Kulkarni</div>
            <div className="text-[11.5px] font-bold text-[#CFE3D6] mt-0.5 truncate">Routine checkup · Home visit</div>
          </div>
        </button>

        <div className="flex items-center justify-between mb-2.5 text-xs font-black text-ink-soft uppercase tracking-wide">
          <span>Today&apos;s schedule</span>
        </div>
        <div>
          {appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} onClick={() => openAppointment(appointment.id)} />)}
        </div>

        <div className="mt-5.5 mb-2.5 text-xs font-black text-ink-soft uppercase tracking-wide">Completed earlier</div>
        <AppointmentCard appointment={completedAppointment} onClick={() => openAppointment(completedAppointment.id)} completed />

        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.75 text-xs text-[#7A5015] font-bold leading-relaxed mt-4">
          Tapping any appointment opens the visit&apos;s full detail: patient notes, reason, and a way to message or call before you arrive.
        </div>
      </div>
    </div>
  )
}

function AppointmentCard({ appointment, onClick, completed = false }: { appointment: Appointment; onClick: () => void; completed?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full bg-white rounded-[18px] px-4 py-3.5 mb-2.5 flex items-center gap-3.5 shadow-sm text-left ${completed ? 'opacity-70' : ''}`}>
      <div className={`font-extrabold text-[13px] min-w-[56px] text-center rounded-xl px-1 py-2 leading-tight ${completed ? 'bg-[#E5E7E1] text-ink-soft' : 'bg-brand-green-tint text-brand-green'}`}>
        {appointment.time}<br />{appointment.period}
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-[13px] flex-shrink-0 ${completed ? 'bg-[#C7CFC5]' : 'bg-[#9AA69C]'} text-white`}>
        {appointment.initials}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="m-0 mb-0.5 text-sm text-ink font-extrabold truncate">{appointment.name}</h2>
        <p className="m-0 text-[11px] text-ink-soft font-bold truncate">{appointment.detail}</p>
      </div>
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${completed ? 'bg-[#E5E7E1] text-ink-soft' : 'bg-brand-green-tint text-brand-green'}`}>
        {appointment.status}
      </span>
      <ChevronRight size={15} className="text-ink-soft flex-shrink-0" />
    </button>
  )
}
