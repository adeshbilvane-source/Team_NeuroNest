import { ArrowLeft, Camera, FileUp, Menu, Mic, Phone, Send, Smile, Video } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PatientAvatar from '../../components/PatientAvatar'

export default function DoctorChatThreadPage() {
  const navigate = useNavigate()
  const { threadId } = useParams()
  const isSunita = threadId === 'sunita-rao'
  const patient = isSunita ? { initials: 'SR', name: 'Sunita Rao', phone: '+919800002103' } : { initials: 'RK', name: 'Ramesh Kulkarni', phone: '+919800002101' }
  const [input, setInput] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const attachmentRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState([{ text: `Good morning, ${patient.name.split(' ')[0]}. How are you feeling today?`, mine: false, time: '9:02 AM' }, { text: isSunita ? 'My chest feels tight and I feel dizzy.' : 'A little tired, but I did my memory game already.', mine: true, time: '9:05 AM' }, { text: isSunita ? 'Please sit down. I am calling your caregiver now.' : "That's wonderful. I saw your scores. Don't forget your 2 PM medicine.", mine: false, time: '9:06 AM' }])
  const send = (value = input) => { if (!value.trim()) return; const now = new Date(); setMessages((items) => [...items, { text: value.trim(), mine: true, time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]); setInput('') }
  const addActionMessage = (text: string) => { const now = new Date(); setMessages((items) => [...items, { text, mine: true, time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]) }
  const startVoiceInput = () => {
    const Recognition = (window as typeof window & { SpeechRecognition?: new () => { lang: string; start: () => void; onstart: (() => void) | null; onend: (() => void) | null; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null } }).SpeechRecognition
    if (!Recognition) return
    const recognition = new Recognition()
    recognition.lang = 'en-IN'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => setInput((value) => `${value} ${event.results[0][0].transcript}`.trim())
    recognition.start()
  }
  const addFileMessage = (file?: File) => { if (file) addActionMessage(`Shared ${file.name}`) }

  return <div className="doctor-chat-page h-full min-h-0 bg-canvas font-ui flex flex-col">
    <div className="chat-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-2"><button onClick={() => navigate('/doctor/chat')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button><PatientAvatar patientId={threadId || 'ramesh-kulkarni'} initials={patient.initials} name={patient.name} className="w-11 h-11 rounded-full bg-brand-green text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0" /><div className="min-w-0 flex-1"><h1 className="m-0 text-[15.5px] font-extrabold text-ink truncate">{patient.name}</h1><p className="m-0 mt-0.5 text-[11.5px] font-bold text-brand-green">● Online</p></div><button onClick={() => addActionMessage('Video call started')} aria-label="Start video call" className="w-[34px] h-[34px] rounded-xl bg-brand-green-tint flex items-center justify-center"><Video size={17} className="text-brand-green" /></button><button onClick={() => window.location.href = `tel:${patient.phone}`} aria-label="Call" className="w-[34px] h-[34px] rounded-xl bg-brand-green-tint flex items-center justify-center"><Phone size={17} className="text-brand-green" /></button><button onClick={() => setShowMenu((value) => !value)} aria-label="More options" className="w-[34px] h-[34px] rounded-xl bg-brand-green-tint flex items-center justify-center"><Menu size={18} className="text-brand-green" /></button></div>
    {showMenu && <div className="absolute right-4 top-[94px] z-20 w-44 bg-white border border-brand-green-tint rounded-xl shadow-lg p-1.5"><button onClick={() => setShowMenu(false)} className="w-full text-left px-3 py-2 text-xs font-extrabold text-ink rounded-lg hover:bg-canvas">View patient details</button><button onClick={() => { setShowMenu(false); addActionMessage('Follow-up reminder set for tomorrow') }} className="w-full text-left px-3 py-2 text-xs font-extrabold text-ink rounded-lg hover:bg-canvas">Set follow-up reminder</button></div>}
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"> <div className="text-center text-[11px] font-extrabold text-ink-soft my-1.5">Today</div>{messages.map((message, index) => <div key={`${message.time}-${index}`}><div className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[76%] px-3.5 py-2.75 rounded-[18px] text-sm font-bold leading-relaxed ${message.mine ? 'bg-brand-green text-white rounded-br-[5px]' : 'bg-white text-ink shadow-sm rounded-bl-[5px]'}`}>{message.text}</div></div><div className={`text-[10px] font-bold text-ink-soft mt-1 ${message.mine ? 'text-right' : ''}`}>{message.time}</div></div>)}</div>
    <div className="px-4 pb-2 flex gap-2 overflow-x-auto"><button onClick={() => send("I'm feeling fine")} className="flex-shrink-0 bg-white border border-brand-green-tint text-brand-green font-extrabold text-xs px-3.5 py-2 rounded-full">I&apos;m feeling fine</button><button onClick={() => send('I need an appointment')} className="flex-shrink-0 bg-white border border-brand-green-tint text-brand-green font-extrabold text-xs px-3.5 py-2 rounded-full">I need an appointment</button></div>
    <div className="bg-white px-4 pt-2.5 pb-3 flex items-center gap-1.5 shadow-[0_-6px_16px_rgba(36,50,42,0.06)]"><button onClick={() => setInput((value) => `${value} 🙂`)} aria-label="Add emoji" className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft"><Smile size={19} /></button><input ref={attachmentRef} type="file" className="sr-only" onChange={(event) => addFileMessage(event.target.files?.[0])} /><button onClick={() => attachmentRef.current?.click()} aria-label="Attach file" className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft"><FileUp size={18} /></button><input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => addFileMessage(event.target.files?.[0])} /><button onClick={() => cameraRef.current?.click()} aria-label="Take a photo" className="w-9 h-9 rounded-full flex items-center justify-center text-ink-soft"><Camera size={18} /></button><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Type a message..." className="flex-1 min-w-0 bg-canvas rounded-full px-3.5 py-3 text-sm font-bold text-ink outline-none" /><button onClick={startVoiceInput} aria-label={isListening ? 'Listening' : 'Speak message'} className={`w-10 h-10 rounded-full flex items-center justify-center ${isListening ? 'bg-marigold text-white' : 'bg-marigold-tint text-marigold'}`}><Mic size={18} /></button><button onClick={() => send()} aria-label="Send message" className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center"><Send size={18} className="text-white" /></button></div>
  </div>
}
