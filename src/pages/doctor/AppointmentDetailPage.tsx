import { ArrowLeft, MessageCircle, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../components/Toast'

export default function AppointmentDetailPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/doctor/appointments/today')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} />
        </button>
        <h1 className="font-display italic font-semibold text-xl text-ink">Appointment Detail</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <section className="bg-gradient-to-br from-brand-green to-[#345943] rounded-[22px] p-5.5 text-center shadow-lg mb-4.5">
          <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center font-extrabold text-[22px] mx-auto mb-2.5">RK</div>
          <h2 className="font-display italic font-semibold text-[19px] text-white m-0">Ramesh Kulkarni</h2>
          <p className="text-[12.5px] font-bold text-[#CFE3D6] mt-1">Age 74 · Diabetic, Osteoarthritis</p>
          <div className="inline-block bg-white/20 text-white font-extrabold text-[12.5px] px-3.5 py-1.5 rounded-full mt-3">Today · 11:00 AM</div>
        </section>

        <div className="text-xs font-black text-ink-soft uppercase tracking-wide mb-2.5">Visit details</div>
        <div className="grid grid-cols-2 gap-2.5 mb-4.5">
          <InfoBox label="Visit Type" value="Home visit" />
          <InfoBox label="Reason" value="Routine checkup" />
          <InfoBox label="Address" value="Wardha Rd, Nagpur" />
          <InfoBox label="Status" value="Confirmed" valueClass="text-brand-green" />
        </div>

        <div className="text-xs font-black text-ink-soft uppercase tracking-wide mb-2.5">Notes from last visit</div>
        <div className="bg-white rounded-2xl p-3.5 px-4 shadow-sm mb-4.5">
          <p className="m-0 text-[13px] text-ink font-bold leading-relaxed">Blood pressure trending slightly high (138/88). Follow up on medication dosage today. Patient reported occasional dizziness in the mornings.</p>
        </div>

        <div className="flex gap-2.5 mb-2.5">
          <button onClick={() => showToast('Message composer is ready.', 'info')} className="flex-1 bg-brand-green text-white rounded-[15px] py-3.5 font-extrabold text-[13.5px] flex items-center justify-center gap-1.5"><MessageCircle size={17} /> Message</button>
          <button onClick={() => showToast('Calling Ramesh Kulkarni.', 'info')} className="flex-1 bg-white text-ink rounded-[15px] py-3.5 font-extrabold text-[13.5px] flex items-center justify-center gap-1.5 shadow-sm"><Phone size={17} /> Call</button>
        </div>
        <button onClick={() => showToast('Reschedule options are ready.', 'info')} className="w-full bg-marigold-tint text-[#8A5A1C] rounded-[15px] py-3 font-extrabold text-[13px]">Reschedule this visit</button>

        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.75 text-xs text-[#7A5015] font-bold leading-relaxed mt-4">
          This is the same detail screen whether opened from the home banner or today&apos;s appointment list.
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value, valueClass = 'text-ink' }: { label: string; value: string; valueClass?: string }) {
  return <div className="bg-white rounded-[14px] p-3 px-3.5 shadow-sm"><div className="text-[10px] uppercase tracking-wide text-ink-soft font-extrabold">{label}</div><div className={`text-sm font-extrabold ${valueClass} mt-0.5`}>{value}</div></div>
}
