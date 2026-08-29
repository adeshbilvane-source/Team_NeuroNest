import { ArrowLeft, BarChart3, CalendarDays, ChevronRight, MessageCircle, Search, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientAvatar from '../../components/PatientAvatar'
import { useUniversalSearch, type SearchCategory } from '../../hooks/useUniversalSearch'

const categoryIcons: Record<SearchCategory, typeof UserRound> = {
  patients: UserRound,
  appointments: CalendarDays,
  messages: MessageCircle,
  analytics: BarChart3,
}

export default function DoctorSearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const groups = useUniversalSearch(query)
  const resultCount = groups.reduce((count, group) => count + group.results.length, 0)
  return <div className="min-h-screen bg-canvas font-ui flex flex-col">
    <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3"><button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[56px] h-[56px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={22} className="text-brand-green" strokeWidth={2.6} /></button><h1 className="font-display italic font-semibold text-xl text-ink">Universal Search</h1></div>
    <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
      <div className="relative">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm min-h-[64px] overflow-hidden"><Search size={23} className="text-ink-soft flex-shrink-0" aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients, appointments, messages, and analytics..." aria-label="Search patients, appointments, messages, and analytics" className="border-0 outline-none bg-transparent font-ui text-[15px] font-bold text-ink min-w-0 flex-1 min-h-[40px] placeholder:text-ink-soft placeholder:opacity-100" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="w-[40px] h-[40px] rounded-full bg-brand-green-tint border-0 flex items-center justify-center text-brand-green flex-shrink-0"><X size={17} /></button>}</div>
        {query && <div className="absolute z-20 top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-lg border border-brand-green-tint p-3 max-h-[65vh] overflow-y-auto" role="listbox" aria-label="Search results">
          {groups.length > 0 ? <>
            <div className="text-xs font-black text-ink-soft uppercase tracking-wide px-2 pb-2">{resultCount} results</div>
            {groups.map((group) => {
              const Icon = categoryIcons[group.category]
              return <section key={group.category} aria-labelledby={`search-${group.category}`}>
                <h2 id={`search-${group.category}`} className="flex items-center gap-2 text-xs font-black text-brand-green uppercase tracking-wide px-2 pt-3 pb-1.5"><Icon size={16} aria-hidden="true" />{group.label}</h2>
                {group.results.map((result) => <button key={`${result.category}-${result.id}`} type="button" role="option" onClick={() => navigate(result.route)} className="w-full min-h-[64px] rounded-xl px-3 py-2.5 flex items-center gap-3 text-left hover:bg-brand-green-tint focus-visible:outline-2 focus-visible:outline-brand-green">
                  {result.category === 'patients' ? <PatientAvatar patientId={result.id} initials={result.initials || ''} name={result.title} className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0" /> : <span className="w-10 h-10 rounded-xl bg-canvas flex items-center justify-center text-brand-green flex-shrink-0"><Icon size={19} aria-hidden="true" /></span>}
                  <span className="min-w-0 flex-1"><span className="block text-[14px] text-ink font-extrabold truncate">{result.title}</span><span className="block text-[11.5px] text-ink-soft font-bold truncate">{result.subtitle}</span></span><ChevronRight size={18} className="text-ink-soft flex-shrink-0" aria-hidden="true" />
                </button>)}
              </section>
            })}
          </> : <div className="text-center px-5 py-8 text-ink-soft text-[13px] font-bold" role="status">No results found for '{query}'</div>}
        </div>}
      </div>
      {!query && <div className="text-center px-5 py-12 text-ink-soft text-[13px] font-bold">Search across patients, appointments, messages, and analytics.</div>}
    </div>
  </div>
}
