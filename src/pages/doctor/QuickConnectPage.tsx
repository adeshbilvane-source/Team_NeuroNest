import { ArrowLeft, CheckCircle2, ExternalLink, Phone, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CONTACTS = [
  { name: 'Ramesh Kulkarni', role: 'Family caregiver', initials: 'RK', phone: '+919800002101', status: 'Available now' },
  { name: 'Vikram Patil', role: 'Patient', initials: 'VP', phone: '+919800002102', status: 'Available now' },
  { name: 'Anjali Deshmukh', role: 'Patient', initials: 'AD', phone: '+919800002103', status: 'Last seen 12 min ago' },
]

function openVideoRoom(name: string) {
  const room = window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer')
  if (!room) {
    window.location.href = 'https://meet.google.com/new'
    return
  }
  window.alert(`Video room opened for ${name}. Share the room link with them to join.`)
}

export default function QuickConnectPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button
          onClick={() => navigate('/doctor')}
          aria-label="Back"
          className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} />
        </button>
        <div>
          <h1 className="font-display italic font-semibold text-xl text-ink">Quick Connect</h1>
          <p className="m-0 text-[11px] text-ink-soft font-bold">Reach a patient directly</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <div className="bg-marigold-tint rounded-2xl px-4 py-3.5 mb-5 flex gap-3 items-start">
          <CheckCircle2 size={19} className="text-marigold flex-shrink-0 mt-0.5" />
          <p className="m-0 text-[12px] font-bold text-[#7a5015] leading-relaxed">
            Choose a patient, then call or open a video room. Calls use your device phone app.
          </p>
        </div>

        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">Patients and caregivers</div>
        {CONTACTS.map((contact) => (
          <div key={contact.phone} className="bg-white rounded-2xl p-3.5 mb-2.5 shadow-sm">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                {contact.initials}
              </div>
              <div className="min-w-0">
                <h2 className="m-0 text-[14.5px] font-extrabold text-ink truncate">{contact.name}</h2>
                <p className="m-0 mt-0.5 text-[11px] text-ink-soft font-bold">{contact.role}</p>
                <p className={`m-0 mt-1 text-[10.5px] font-extrabold ${contact.status === 'Available now' ? 'text-brand-green' : 'text-ink-soft'}`}>
                  {contact.status}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="bg-brand-green text-white rounded-xl py-2.5 font-extrabold text-[12.5px] flex items-center justify-center gap-1.5 no-underline"
              >
                <Phone size={15} strokeWidth={2.5} /> Call
              </a>
              <button
                onClick={() => openVideoRoom(contact.name)}
                className="bg-brand-green-tint text-brand-green rounded-xl py-2.5 font-extrabold text-[12.5px] flex items-center justify-center gap-1.5"
              >
                <Video size={15} strokeWidth={2.5} /> Video call
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft font-bold">
          <ExternalLink size={13} /> Video calls open Google Meet in a new tab.
        </div>
      </div>
    </div>
  )
}
