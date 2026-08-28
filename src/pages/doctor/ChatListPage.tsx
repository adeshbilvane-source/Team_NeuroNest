import { ArrowLeft, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const conversations = [
  { id: 'ramesh-kulkarni', initials: 'RK', name: 'Ramesh Kulkarni', message: '"Should I take the tablet before food?"', time: '9:14 AM', unread: true },
  { id: 'sunita-rao', initials: 'SR', name: 'Sunita Rao', message: 'Chest feels tight and I\'m dizzy…', time: '11:42 AM', unread: true, urgent: true },
  { id: 'vikram-patil', initials: 'VP', name: 'Vikram Patil', message: 'Thank you doctor, feeling better', time: 'Yesterday', unread: false },
  { id: 'anjali-deshmukh', initials: 'AD', name: 'Anjali Deshmukh', message: 'Can we move Friday to 11?', time: 'Yesterday', unread: true },
]

export default function DoctorChatListPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const results = useMemo(() => conversations.filter((conversation) => `${conversation.name} ${conversation.message}`.toLowerCase().includes(query.toLowerCase())), [query])

  return <div className="min-h-screen bg-canvas font-ui flex flex-col">
    <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3"><button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button><h1 className="font-display italic font-semibold text-xl text-ink">Patient Chat</h1></div>
    <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8"><div className="bg-white rounded-2xl px-3.5 py-2.75 flex items-center gap-2.5 shadow-sm mb-4"><Search size={18} className="text-ink-soft flex-shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations..." className="w-full border-0 outline-none bg-transparent font-ui text-[13px] font-bold text-ink" /></div>
      {results.map((conversation) => <button key={conversation.id} onClick={() => navigate(`/doctor/chat/${conversation.id}`)} className={`w-full bg-white rounded-[18px] px-3.5 py-3 mb-2.5 flex items-center gap-3 shadow-sm text-left ${conversation.urgent ? 'border-[1.5px] border-alert-red' : ''}`}><div className={`w-11 h-11 rounded-full ${conversation.urgent ? 'bg-alert-red' : 'bg-[#9AA69C]'} text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0`}>{conversation.initials}</div><div className="min-w-0 flex-1"><h2 className="m-0 mb-0.5 text-[14.5px] text-ink font-extrabold flex items-center gap-1.5 truncate">{conversation.name}{conversation.urgent && <span className="text-[9px] font-black bg-red-tint text-alert-red px-1.75 py-0.5 rounded-full">Urgent</span>}</h2><p className="m-0 text-[11.5px] text-ink-soft font-bold truncate">{conversation.message}</p></div><div className="text-right flex-shrink-0"><div className="text-[10.5px] text-ink-soft font-bold">{conversation.time}</div>{conversation.unread && <div className="w-2.25 h-2.25 rounded-full bg-alert-red mt-1.25 ml-auto" />}</div><ChevronRight size={15} className="text-ink-soft flex-shrink-0" /></button>)}
      <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.75 text-xs text-[#7A5015] font-bold leading-relaxed mt-1.5">Unread conversations carry a dot; a red outline flags anything urgent. Tapping a conversation opens the thread.</div>
    </div>
  </div>
}
