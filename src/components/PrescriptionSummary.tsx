import { ChevronRight, ClipboardPlus, Pill } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { loadMedicines } from '../services/prescriptions'

export default function PrescriptionSummary({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const medicines = loadMedicines(patientId).filter((medicine) => medicine.active)

  return (
    <section className="bg-white rounded-2xl px-4 py-4 mb-4.5 shadow-sm" aria-labelledby="prescription-summary-title">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-marigold-tint text-[#7A5015] flex items-center justify-center flex-shrink-0">
          <Pill size={21} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="prescription-summary-title" className="m-0 text-[15px] font-extrabold text-ink">Current medicines</h2>
          <p className="m-0 mt-0.5 text-[11.5px] font-bold text-ink-soft">{medicines.length ? 'Medicines currently planned for this patient' : 'No medicines have been added yet'}</p>
        </div>
      </div>
      {medicines.length > 0 && (
        <ul className="m-0 mt-3 pl-0 list-none space-y-2">
          {medicines.slice(0, 3).map((medicine) => <li key={medicine.id} className="flex items-center gap-2 text-[13px] font-extrabold text-ink"><span className="w-1.5 h-1.5 rounded-full bg-marigold flex-shrink-0" aria-hidden="true" />{medicine.name} {medicine.dosage}</li>)}
        </ul>
      )}
      <button type="button" onClick={() => navigate(`/doctor/patients/${patientId}/prescriptions`)} className="w-full mt-4 min-h-[56px] rounded-xl bg-brand-green text-white px-4 flex items-center justify-center gap-2 font-extrabold text-[13px]">
        <ClipboardPlus size={18} aria-hidden="true" /> Add / Manage Prescriptions <ChevronRight size={17} aria-hidden="true" />
      </button>
    </section>
  )
}