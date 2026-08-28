import { ArrowLeft, ChevronRight, Search, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientAvatar from '../../components/PatientAvatar'

const patients = [{ id: 'ramesh-kulkarni', initials: 'RK', name: 'Ramesh Kulkarni', detail: 'Age 74 · Next visit today, 11:00 AM' }, { id: 'sneha-kulkarni', initials: 'SK', name: 'Sneha Kulkarni', detail: 'Age 45 · Last visit 3 days ago', gray: true }]

export default function DoctorSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('Ku')
  const results = patients.filter((patient) => `${patient.name} ${patient.detail}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="min-h-screen bg-canvas font-ui flex flex-col">
    <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3"><button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button><h1 className="font-display italic font-semibold text-xl text-ink">Search Patients</h1></div>
    <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8"><div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm mb-4.5"><Search size={19} className="text-ink-soft flex-shrink-0" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients..." className="border-0 outline-none bg-transparent font-ui text-sm font-bold text-ink w-full" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="w-[22px] h-[22px] rounded-full bg-brand-green-tint border-0 flex items-center justify-center text-brand-green"><X size={13} /></button>}</div>
      {query && <div className="text-xs font-black text-ink-soft uppercase tracking-wide mb-2.5">{results.length} results</div>}
      {results.map((patient) => <button key={patient.id} onClick={() => navigate(`/doctor/patients/${patient.id}`)} className="w-full bg-white rounded-[18px] px-3.5 py-3 mb-2.5 flex items-center gap-3 shadow-sm text-left"><PatientAvatar patientId={patient.id} initials={patient.initials} name={patient.name} className={`w-[46px] h-[46px] rounded-full ${patient.gray ? 'bg-[#9AA69C]' : 'bg-brand-green'} text-white flex items-center justify-center font-extrabold text-[15px] flex-shrink-0`} /><div className="min-w-0 flex-1"><h2 className="m-0 mb-0.5 text-[14.5px] text-ink font-extrabold truncate">{patient.name}</h2><p className="m-0 text-[11.5px] text-ink-soft font-bold truncate">{patient.detail}</p></div><ChevronRight size={16} className="text-ink-soft flex-shrink-0" /></button>)}
      {!results.length && <div className="text-center px-5 py-7.5 text-ink-soft text-[12.5px] font-bold">No patients found.</div>}
    </div>
  </div>
}
