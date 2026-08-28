import { ArrowLeft, ChevronRight, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PatientAvatar from '../../components/PatientAvatar'

const patients = [
  { id: 'ramesh-kulkarni', initials: 'RK', name: 'Ramesh Kulkarni', detailKey: 'ramesh' },
  { id: 'sunita-rao', initials: 'SR', name: 'Sunita Rao', detailKey: 'sunita', urgent: true },
  { id: 'vikram-patil', initials: 'VP', name: 'Vikram Patil', detailKey: 'vikram' },
  { id: 'anjali-deshmukh', initials: 'AD', name: 'Anjali Deshmukh', detailKey: 'anjali' },
  { id: 'manoj-joshi', initials: 'MJ', name: 'Manoj Joshi', detailKey: 'manoj' },
]

export default function PatientsListPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button>
        <h1 className="font-display italic font-semibold text-xl text-ink">{t('doctor.patientsCount', { count: 12 })}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <button onClick={() => navigate('/doctor/search')} className="w-full bg-white rounded-2xl px-3.5 py-3 flex items-center gap-2.5 shadow-sm mb-4 text-left text-[13px] font-bold text-ink-soft"><Search size={18} strokeWidth={2.3} /> {t('doctor.searchPatients')}</button>
        <div className="text-xs font-black text-ink-soft uppercase tracking-wide mb-2.5">{t('doctor.allPatients')}</div>
        {patients.map((patient) => <button key={patient.id} onClick={() => navigate(`/doctor/patients/${patient.id}`)} className="w-full bg-white rounded-[18px] px-3.5 py-3 mb-2.5 flex items-center gap-3 shadow-sm text-left">
          <PatientAvatar patientId={patient.id} initials={patient.initials} name={patient.name} className={`w-11 h-11 rounded-full ${patient.urgent ? 'bg-alert-red' : 'bg-[#9AA69C]'} text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0`} />
          <div className="min-w-0 flex-1"><h2 className="m-0 mb-0.5 text-[14.5px] text-ink font-extrabold truncate">{patient.name}</h2><p className="m-0 text-[11.5px] text-ink-soft font-bold truncate">{t(`doctor.patientDetails.${patient.detailKey}`)}</p></div>
          {patient.urgent && <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-tint text-alert-red">{t('doctor.urgent')}</span>}
          <ChevronRight size={16} className="text-ink-soft flex-shrink-0" />
        </button>)}
        <div className="bg-marigold-tint border-l-4 border-marigold rounded-xl px-3.5 py-2.75 text-xs text-[#7A5015] font-bold leading-relaxed mt-1.5">{t('doctor.rosterHint')}</div>
      </div>
    </div>
  )
}
