import { ArrowLeft, Check, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientAvatar from '../../components/PatientAvatar'

const initialRequests = [
  { id: 1, initials: 'AD', name: 'Anjali Deshmukh', time: 'Requested 2 hours ago', request: 'Friday, 10:00 AM', reason: 'Medication review' },
  { id: 2, initials: 'MJ', name: 'Manoj Joshi', time: 'Requested yesterday', request: 'Saturday, 4:30 PM', reason: 'New patient intake' },
]

export default function PendingRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(initialRequests)

  const updateRequest = (id: number, accepted: boolean) => {
    const request = requests.find((item) => item.id === id)
    if (request && accepted) {
      const raw = localStorage.getItem('sahayak_appointments')
      const appointments = raw ? JSON.parse(raw) : []
      const nextAppointment = {
        id: `request-${request.id}`,
        doctorName: 'Dr. Meera Joshi',
        patientName: request.name,
        role: 'Family Doctor',
        date: request.request.split(',')[0],
        time: request.request.split(', ')[1],
        reason: request.reason,
        status: 'Confirmed',
      }
      localStorage.setItem('sahayak_appointments', JSON.stringify([nextAppointment, ...appointments]))
    }
    setRequests((items) => items.filter((item) => item.id !== id))
  }

  return <div className="min-h-screen bg-canvas font-ui flex flex-col">
    <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3"><button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button><h1 className="font-display italic font-semibold text-xl text-ink">Pending Requests</h1></div>
    <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
      <div className="inline-block bg-marigold-tint text-[#8A5A1C] font-extrabold text-xs px-3.5 py-1.5 rounded-full mb-4.5">{requests.length} waiting for your response</div>
      {requests.map((request) => <div key={request.id} className="bg-white rounded-[18px] p-4 mb-3.5 shadow-sm">
        <div className="flex items-center gap-3 mb-3"><PatientAvatar patientId={request.name === 'Anjali Deshmukh' ? 'anjali-deshmukh' : 'manoj-joshi'} initials={request.initials} name={request.name} className="w-11 h-11 rounded-full bg-[#9AA69C] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0" /><div><h2 className="m-0 text-[14.5px] text-ink font-extrabold">{request.name}</h2><p className="m-0 mt-0.5 text-[11.5px] text-ink-soft font-bold">{request.time}</p></div></div>
        <div className="bg-canvas rounded-xl px-3 py-2.5 mb-3 text-[12.5px] text-ink font-bold leading-relaxed">Wants <b className="text-brand-green">{request.request}</b> · Reason: {request.reason}</div>
        <div className="flex gap-2.5"><button onClick={() => updateRequest(request.id, true)} className="flex-1 bg-brand-green text-white border-0 rounded-[13px] py-2.75 font-extrabold text-[13px] flex items-center justify-center gap-1.5"><Check size={16} /> Accept</button><button onClick={() => updateRequest(request.id, false)} className="flex-1 bg-canvas text-ink border border-[#C7D3C9] rounded-[13px] py-2.75 font-extrabold text-[13px] flex items-center justify-center gap-1.5"><X size={15} /> Decline</button></div>
      </div>)}
      {!requests.length && <div className="text-center py-10 text-ink-soft text-sm font-bold">You&apos;re all caught up.</div>}
    </div>
  </div>
}
