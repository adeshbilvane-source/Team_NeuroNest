import { ArrowLeft, Check } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialRequests = [
  { id: 1, initials: 'AD', name: 'Anjali Deshmukh', time: 'Requested 2 hours ago', request: 'Friday, 10:00 AM', reason: 'Medication review' },
  { id: 2, initials: 'MJ', name: 'Manoj Joshi', time: 'Requested yesterday', request: 'Saturday, 4:30 PM', reason: 'New patient intake' },
]

export default function PendingRequestsPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState(initialRequests)

  const removeRequest = (id: number) => setRequests((items) => items.filter((request) => request.id !== id))

  return <div className="min-h-screen bg-canvas font-ui flex flex-col">
    <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3"><button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button><h1 className="font-display italic font-semibold text-xl text-ink">Pending Requests</h1></div>
    <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
      <div className="inline-block bg-marigold-tint text-[#8A5A1C] font-extrabold text-xs px-3.5 py-1.5 rounded-full mb-4.5">{requests.length} waiting for your response</div>
      {requests.map((request) => <div key={request.id} className="bg-white rounded-[18px] p-4 mb-3.5 shadow-sm">
        <div className="flex items-center gap-3 mb-3"><div className="w-11 h-11 rounded-full bg-[#9AA69C] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">{request.initials}</div><div><h2 className="m-0 text-[14.5px] text-ink font-extrabold">{request.name}</h2><p className="m-0 mt-0.5 text-[11.5px] text-ink-soft font-bold">{request.time}</p></div></div>
        <div className="bg-canvas rounded-xl px-3 py-2.5 mb-3 text-[12.5px] text-ink font-bold leading-relaxed">Wants <b className="text-brand-green">{request.request}</b> · Reason: {request.reason}</div>
        <div className="flex gap-2.5"><button onClick={() => removeRequest(request.id)} className="flex-1 bg-brand-green text-white border-0 rounded-[13px] py-2.75 font-extrabold text-[13px] flex items-center justify-center gap-1.5"><Check size={16} /> Accept</button><button onClick={() => removeRequest(request.id)} className="flex-1 bg-canvas text-ink border border-[#C7D3C9] rounded-[13px] py-2.75 font-extrabold text-[13px]">Decline</button></div>
      </div>)}
      <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.75 text-xs text-[#7A5015] font-bold leading-relaxed mt-1.5">Each request shows who, when, and why. Accept confirms it straight onto today&apos;s calendar. Decline asks the patient to pick a new time.</div>
    </div>
  </div>
}
