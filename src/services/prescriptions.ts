export interface Medicine {
  id: string
  patientId: string
  name: string
  dosage: string
  instructions: string
  active: boolean
}

export interface Reminder {
  id: string
  patientId: string
  medicineId: string
  time: string
  label: string
  enabled: boolean
}

const DEFAULT_MEDICINES: Record<string, Medicine[]> = {
  'ramesh-kulkarni': [
    { id: 'ramesh-metformin', patientId: 'ramesh-kulkarni', name: 'Metformin', dosage: '500mg', instructions: 'Take with breakfast', active: true },
    { id: 'ramesh-lisinopril', patientId: 'ramesh-kulkarni', name: 'Lisinopril', dosage: '10mg', instructions: 'Take in the morning', active: true },
  ],
  'sunita-rao': [
    { id: 'sunita-amlodipine', patientId: 'sunita-rao', name: 'Amlodipine', dosage: '5mg', instructions: 'Take after breakfast', active: true },
    { id: 'sunita-paracetamol', patientId: 'sunita-rao', name: 'Paracetamol', dosage: '500mg', instructions: 'Take only when needed', active: true },
  ],
}

function storageKey(patientId: string, kind: 'medicines' | 'reminders') {
  return `sahayak_${kind}_${patientId}`
}

export function loadMedicines(patientId: string): Medicine[] {
  try {
    const stored = localStorage.getItem(storageKey(patientId, 'medicines'))
    return stored ? JSON.parse(stored) as Medicine[] : DEFAULT_MEDICINES[patientId] ?? []
  } catch {
    return DEFAULT_MEDICINES[patientId] ?? []
  }
}

export function saveMedicines(patientId: string, medicines: Medicine[]) {
  localStorage.setItem(storageKey(patientId, 'medicines'), JSON.stringify(medicines))
}

export function loadReminders(patientId: string): Reminder[] {
  try {
    const stored = localStorage.getItem(storageKey(patientId, 'reminders'))
    return stored ? JSON.parse(stored) as Reminder[] : []
  } catch {
    return []
  }
}

export function saveReminders(patientId: string, reminders: Reminder[]) {
  localStorage.setItem(storageKey(patientId, 'reminders'), JSON.stringify(reminders))
}

export interface MedicineCatalogItem {
  id: string
  name: string
  commonDosage: string
}

const DEFAULT_MEDICINE_CATALOG: MedicineCatalogItem[] = [
  { id: 'metformin', name: 'Metformin', commonDosage: '500mg' },
  { id: 'lisinopril', name: 'Lisinopril', commonDosage: '10mg' },
  { id: 'amlodipine', name: 'Amlodipine', commonDosage: '5mg' },
  { id: 'paracetamol', name: 'Paracetamol', commonDosage: '500mg' },
]

export function loadMedicineCatalog(): MedicineCatalogItem[] {
  try {
    const stored = localStorage.getItem('sahayak_medicine_catalog')
    return stored ? JSON.parse(stored) as MedicineCatalogItem[] : DEFAULT_MEDICINE_CATALOG
  } catch {
    return DEFAULT_MEDICINE_CATALOG
  }
}

export function saveMedicineCatalog(catalog: MedicineCatalogItem[]) {
  localStorage.setItem('sahayak_medicine_catalog', JSON.stringify(catalog))
}