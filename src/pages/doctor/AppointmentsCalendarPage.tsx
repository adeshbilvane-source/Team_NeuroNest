import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import PatientAvatar from '../../components/PatientAvatar'

// Placeholder data — replace with real Firebase/store data once wired.
// Appointment dates are hardcoded against August 2026 specifically;
// they will NOT line up correctly if you navigate to a different month
// with the arrows below. Wire this to a real query keyed on the
// visible month before shipping.

type Appointment = {
  id: string
  day: number // day-of-month this appointment falls on
  time: string
  patientInitials: string
  patientName: string
  reason: string
}

const MOCK_MONTH_LABEL = 'August 2026'
const MOCK_YEAR = 2026
const MOCK_MONTH_INDEX = 7 // August, 0-indexed
const TODAY_DAY = 26

// Days (of the visible month) that have at least one appointment
const DAYS_WITH_APPOINTMENTS = new Set([4, 6, 11, 14, 19, 22, 26, 27])

const APPOINTMENTS_BY_DAY: Record<number, Appointment[]> = {
  26: [
    { id: 'a1', day: 26, time: '11:00 AM', patientInitials: 'RK', patientName: 'Ramesh Kulkarni', reason: 'Routine Checkup' },
    { id: 'a2', day: 26, time: '3:00 PM', patientInitials: 'VP', patientName: 'Vikram Patil', reason: 'Follow-up' },
    { id: 'a3', day: 26, time: '5:30 PM', patientInitials: 'AD', patientName: 'Anjali Deshmukh', reason: 'Medication Review' },
  ],
  27: [
    { id: 'a4', day: 27, time: '10:00 AM', patientInitials: 'MJ', patientName: 'Manoj Joshi', reason: 'New Patient Intake' },
  ],
}

// Calendar grid: Aug 1 2026 falls on a Saturday, so the first row leads
// with muted trailing-July days. Hardcoded to match the mockup exactly.
const LEADING_MUTED_DAYS = [27, 28, 29, 30, 31] // end of July
const DAYS_IN_MONTH = 31

function buildCalendarCells() {
  const cells: { day: number; muted: boolean }[] = []
  LEADING_MUTED_DAYS.forEach((d) => cells.push({ day: d, muted: true }))
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push({ day: d, muted: false })
  return cells
}

const DOW_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function AppointmentsCalendarPage() {
  const navigate = useNavigate()
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY)

  const cells = useMemo(() => buildCalendarCells(), [])
  const dayAppointments = APPOINTMENTS_BY_DAY[selectedDay] ?? []

  const selectedDayLabel = useMemo(() => {
    const date = new Date(MOCK_YEAR, MOCK_MONTH_INDEX, selectedDay)
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  }, [selectedDay])

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
        <h1 className="font-display italic font-semibold text-xl text-ink">Appointments</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display italic font-semibold text-base text-ink m-0">{MOCK_MONTH_LABEL}</h3>
          <div className="flex gap-2">
            <button
              aria-label="Previous month"
              className="w-[30px] h-[30px] rounded-[9px] bg-white shadow-sm flex items-center justify-center"
              // NOT WIRED — see note above about single-month mock data
            >
              <ChevronLeft size={14} className="text-brand-green" strokeWidth={2.8} />
            </button>
            <button
              aria-label="Next month"
              className="w-[30px] h-[30px] rounded-[9px] bg-white shadow-sm flex items-center justify-center"
            >
              <ChevronRight size={14} className="text-brand-green" strokeWidth={2.8} />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm mb-5">
          <div className="grid grid-cols-7 gap-1.5">
            {DOW_LABELS.map((d, i) => (
              <div key={i} className="text-[10px] text-center text-ink-soft font-extrabold pb-1.5">
                {d}
              </div>
            ))}
            {cells.map((cell, i) => {
              const isToday = !cell.muted && cell.day === TODAY_DAY
              const isSelected = !cell.muted && cell.day === selectedDay
              const hasAppt = !cell.muted && DAYS_WITH_APPOINTMENTS.has(cell.day)

              return (
                <button
                  key={i}
                  disabled={cell.muted}
                  onClick={() => !cell.muted && setSelectedDay(cell.day)}
                  className={`aspect-square rounded-[10px] flex items-center justify-center text-xs font-bold relative
                    ${cell.muted ? 'text-[#C7CFC5] cursor-default' : 'text-ink cursor-pointer'}
                    ${isToday ? 'bg-brand-green text-white' : ''}
                    ${isSelected && !isToday ? 'bg-brand-green-tint text-[#2E5140] font-black' : ''}
                  `}
                >
                  {cell.day}
                  {hasAppt && (
                    <span
                      className={`absolute bottom-1 w-[5px] h-[5px] rounded-full ${
                        isToday ? 'bg-white' : 'bg-marigold'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected day's appointments */}
        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">
          {selectedDayLabel} · {dayAppointments.length} {dayAppointments.length === 1 ? 'visit' : 'visits'}
        </div>

        {dayAppointments.length === 0 && (
          <div className="bg-white rounded-2xl px-4 py-6 text-center shadow-sm mb-2">
            <p className="m-0 text-[12.5px] text-ink-soft font-bold">No appointments scheduled this day.</p>
          </div>
        )}

        {dayAppointments.map((appt) => (
          <button
            key={appt.id}
            onClick={() => navigate(`/doctor/appointments/${appt.id}`)}
            className="w-full bg-white rounded-2xl px-3.5 py-3 mb-2.5 flex items-center gap-3 shadow-sm text-left"
          >
            <div className="font-extrabold text-xs text-brand-green min-w-[52px] text-center bg-brand-green-tint rounded-[10px] px-1 py-1.5 leading-tight">
              {appt.time.split(' ')[0]}
              <br />
              {appt.time.split(' ')[1]}
            </div>
            <PatientAvatar patientId={appt.id === 'a1' ? 'ramesh-kulkarni' : appt.id === 'a2' ? 'vikram-patil' : appt.id === 'a3' ? 'anjali-deshmukh' : 'manoj-joshi'} initials={appt.patientInitials} name={appt.patientName} className="w-9 h-9 rounded-full bg-[#9AA69C] text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0" />
            <div>
              <h4 className="m-0 mb-0.5 text-[13.5px] text-ink font-extrabold">{appt.patientName}</h4>
              <p className="m-0 text-ink-soft text-[10.5px] font-bold">{appt.reason}</p>
            </div>
          </button>
        ))}

        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.5 mt-4 text-[12px] font-bold text-[#7a5015] leading-relaxed">
          A marigold dot marks any day with visits scheduled. Tap a day to see that day's list above —
          today is selected by default.
        </div>
      </div>
    </div>
  )
}