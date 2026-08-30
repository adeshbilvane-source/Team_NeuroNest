import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  Clock3,
  Pill,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../components/Toast";
import PatientAvatar from "../../components/PatientAvatar";
import {
  loadMedicineCatalog,
  loadMedicines,
  loadReminders,
  saveMedicineCatalog,
  saveMedicines,
  saveReminders,
  type Medicine,
  type MedicineCatalogItem,
  type Reminder,
} from "../../services/prescriptions";

const PATIENTS: Record<string, { name: string; initials: string }> = {
  "ramesh-kulkarni": { name: "Ramesh Kulkarni", initials: "RK" },
  "sunita-rao": { name: "Sunita Rao", initials: "SR" },
  "vikram-patil": { name: "Vikram Patil", initials: "VP" },
  "anjali-deshmukh": { name: "Anjali Deshmukh", initials: "AD" },
  "manoj-joshi": { name: "Manoj Joshi", initials: "MJ" },
};

const TIME_SLOTS = [
  { value: "08:00", label: "Morning · 8:00 AM" },
  { value: "13:00", label: "Afternoon · 1:00 PM" },
  { value: "20:00", label: "Night · 8:00 PM" },
];

export default function PrescriptionManager() {
  const navigate = useNavigate();
  const { patientId = "ramesh-kulkarni" } = useParams<{ patientId: string }>();
  const patient = PATIENTS[patientId] ?? { name: "Patient", initials: "P" };
  const [medicines, setMedicines] = useState<Medicine[]>(() =>
    loadMedicines(patientId),
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    loadReminders(patientId),
  );
  const [catalog, setCatalog] =
    useState<MedicineCatalogItem[]>(loadMedicineCatalog);
  const [catalogMedicineId, setCatalogMedicineId] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [reminderMedicineQuery, setReminderMedicineQuery] = useState("");
  const [reminderDosage, setReminderDosage] = useState("");
  const [reminderInstructions, setReminderInstructions] = useState("");
  const [selectedTime, setSelectedTime] = useState("08:00");
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [message, setMessage] = useState("");
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState("");
  const [newCatalogDosage, setNewCatalogDosage] = useState("");

  useEffect(() => saveMedicines(patientId, medicines), [patientId, medicines]);
  useEffect(() => saveReminders(patientId, reminders), [patientId, reminders]);
  useEffect(() => saveMedicineCatalog(catalog), [catalog]);

  const activeMedicines = useMemo(
    () => medicines.filter((medicine) => medicine.active),
    [medicines],
  );
  const reminderCatalogResults = useMemo(() => {
    const query = reminderMedicineQuery.trim().toLowerCase();
    return catalog
      .filter(
        (medicine) =>
          !query ||
          `${medicine.name} ${medicine.commonDosage}`
            .toLowerCase()
            .includes(query),
      )
      .slice(0, 6);
  }, [catalog, reminderMedicineQuery]);

  const assignMedicine = (event: React.FormEvent) => {
    event.preventDefault();
    const catalogMedicine = catalog.find(
      (item) => item.id === catalogMedicineId,
    );
    if (!catalogMedicine || !dosage.trim() || !instructions.trim()) return;
    const medicine: Medicine = {
      id: `${patientId}-medicine-${Date.now()}`,
      patientId,
      name: catalogMedicine.name,
      dosage: dosage.trim(),
      instructions: instructions.trim(),
      active: true,
    };
    setMedicines((current) => [...current, medicine]);
    setSelectedMedicineId(medicine.id);
    setCatalogMedicineId("");
    setDosage("");
    setInstructions("");
    setMessage(`${medicine.name} was added to the list.`);
  };

  const addToCatalog = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCatalogName.trim() || !newCatalogDosage.trim()) return;
    const catalogMedicine: MedicineCatalogItem = {
      id: `${newCatalogName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: newCatalogName.trim(),
      commonDosage: newCatalogDosage.trim(),
    };
    setCatalog((current) => [...current, catalogMedicine]);
    setCatalogMedicineId(catalogMedicine.id);
    setNewCatalogName("");
    setNewCatalogDosage("");
    setShowAddMedicineModal(false);
    setMessage(
      `${catalogMedicine.name} is now available in the medicine catalog.`,
    );
  };

  const saveReminderWithMedicine = async (event: React.FormEvent) => {
    event.preventDefault();
    const catalogMedicine = catalog.find(
      (item) => item.id === selectedMedicineId,
    );
    if (
      !catalogMedicine ||
      !reminderDosage.trim() ||
      !reminderInstructions.trim()
    )
      return;
    const existingMedicine = activeMedicines.find(
      (item) => item.name.toLowerCase() === catalogMedicine.name.toLowerCase(),
    );
    const medicine = existingMedicine ?? {
      id: `${patientId}-medicine-${Date.now()}`,
      patientId,
      name: catalogMedicine.name,
      dosage: reminderDosage.trim(),
      instructions: reminderInstructions.trim(),
      active: true,
    };
    if (!existingMedicine) setMedicines((current) => [...current, medicine]);
    const finalTime = isCustomTime ? customTime : selectedTime;
    if (!/^\d{2}:\d{2}$/.test(finalTime)) return;
    const slot = TIME_SLOTS.find((item) => item.value === finalTime);
    const timeLabel = slot?.label ?? `Custom time · ${finalTime}`;
    setReminders((current) => [
      ...current,
      {
        id: `${patientId}-reminder-${Date.now()}`,
        patientId,
        medicineId: medicine.id,
        time: finalTime,
        label: timeLabel,
        enabled: true,
      },
    ]);
    setMessage(
      `Reminder set for ${medicine.name} at ${timeLabel.toLowerCase()}.`,
    );
    setShowReminderModal(false);
  };

  const openReminderFor = (medicineId = "") => {
    const medicine = activeMedicines.find((item) => item.id === medicineId);
    const catalogMedicine = medicine
      ? catalog.find(
          (item) => item.name.toLowerCase() === medicine.name.toLowerCase(),
        )
      : undefined;
    setSelectedMedicineId(catalogMedicine?.id ?? "");
    setReminderMedicineQuery(medicine?.name ?? "");
    setReminderDosage(medicine?.dosage ?? catalogMedicine?.commonDosage ?? "");
    setReminderInstructions(medicine?.instructions ?? "");
    setIsCustomTime(false);
    setCustomTime("");
    setShowReminderModal(true);
  };

  const removeMedicine = (medicineId: string) => {
    setMedicines((current) =>
      current.filter((medicine) => medicine.id !== medicineId),
    );
    setReminders((current) =>
      current.filter((reminder) => reminder.medicineId !== medicineId),
    );
  };

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <header className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/doctor/patients/${patientId}`)}
          aria-label="Back to patient profile"
          className="w-[56px] h-[56px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft size={22} className="text-brand-green" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display italic font-semibold text-xl text-ink truncate">
            Prescriptions
          </h1>
          <p className="m-0 mt-0.5 text-[11px] font-bold text-ink-soft truncate">
            Care plan for {patient.name}
          </p>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center gap-3">
          <PatientAvatar
            patientId={patientId}
            initials={patient.initials}
            name={patient.name}
            className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center font-extrabold flex-shrink-0"
          />
          <div>
            <div className="font-display italic font-semibold text-lg text-ink">
              {patient.name}
            </div>
            <div className="text-[12px] font-bold text-ink-soft">
              Only caregivers can update medicines and reminders.
            </div>
          </div>
        </div>
        {message && (
          <div
            role="status"
            className="mb-4 rounded-xl bg-brand-green-tint px-3.5 py-3 text-[12px] font-extrabold text-[#2E5140] flex items-center gap-2"
          >
            <Check size={17} aria-hidden="true" />
            {message}
          </div>
        )}

        <section className="mb-5" aria-labelledby="medicine-list-title">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <h2
              id="medicine-list-title"
              className="text-xs font-black text-ink-soft uppercase tracking-wide"
            >
              Active medicines
            </h2>
            <button
              type="button"
              onClick={() => setShowAddMedicineModal(true)}
              className="min-h-[48px] rounded-xl bg-brand-green text-white px-3 flex items-center gap-1.5 font-extrabold text-[12px]"
            >
              <Plus size={17} aria-hidden="true" />
              Add medicine
            </button>
          </div>
          {activeMedicines.length ? (
            activeMedicines.map((medicine) => (
              <article
                key={medicine.id}
                className="bg-white rounded-2xl p-4 mb-2.5 shadow-sm flex items-start gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-marigold-tint text-[#7A5015] flex items-center justify-center flex-shrink-0">
                  <Pill size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 text-[14px] font-extrabold text-ink">
                    {medicine.name} {medicine.dosage}
                  </h3>
                  <p className="m-0 mt-1 text-[12px] font-bold text-ink-soft">
                    {medicine.instructions}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openReminderFor(medicine.id)}
                  aria-label={`Add reminder for ${medicine.name}`}
                  title={`Add reminder for ${medicine.name}`}
                  className="w-10 h-10 rounded-xl bg-brand-green-tint text-brand-green flex items-center justify-center flex-shrink-0"
                >
                  <Bell size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => removeMedicine(medicine.id)}
                  aria-label={`Remove ${medicine.name}`}
                  className="w-10 h-10 rounded-xl bg-red-tint text-alert-red flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-5 text-center text-[13px] font-bold text-ink-soft shadow-sm">
              No medicines added yet.
            </div>
          )}
        </section>

        <section aria-labelledby="scheduled-title">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <h2
              id="scheduled-title"
              className="text-xs font-black text-ink-soft uppercase tracking-wide"
            >
              Scheduled reminders
            </h2>
            <button
              type="button"
              onClick={() => openReminderFor()}
              className="min-h-[48px] rounded-xl bg-brand-green-tint text-brand-green px-3 flex items-center gap-1.5 font-extrabold text-[12px]"
            >
              <Plus size={17} aria-hidden="true" />
              New reminder
            </button>
          </div>
          {reminders.length ? (
            reminders.map((reminder) => {
              const medicine = medicines.find(
                (item) => item.id === reminder.medicineId,
              );
              return (
                <div
                  key={reminder.id}
                  className="bg-white rounded-2xl px-4 py-3 mb-2.5 shadow-sm flex items-center gap-3"
                >
                  <Bell size={18} className="text-brand-green flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-extrabold text-ink">
                      {medicine?.name ?? "Medicine"} {medicine?.dosage}
                    </div>
                    <div className="text-[11px] font-bold text-ink-soft">
                      {reminder.label}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-5 text-center text-[13px] font-bold text-ink-soft shadow-sm">
              No reminders set yet.
            </div>
          )}
        </section>
      </main>
      {showAddMedicineModal && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-medicine-dialog-title"
        >
          <form
            onSubmit={assignMedicine}
            className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2
                id="add-medicine-dialog-title"
                className="font-display italic text-lg font-semibold text-ink"
              >
                Add medicine for {patient.name}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddMedicineModal(false)}
                aria-label="Close add medicine form"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-ink-soft"
              >
                <X size={20} />
              </button>
            </div>
            <p className="m-0 text-[12px] font-bold text-ink-soft">
              Choose a medicine from the catalog, then add patient-specific
              details.
            </p>
            <div className="flex gap-2">
              <select
                required
                value={catalogMedicineId}
                onChange={(event) => {
                  setCatalogMedicineId(event.target.value);
                  const item = catalog.find(
                    (medicine) => medicine.id === event.target.value,
                  );
                  setDosage(item?.commonDosage ?? "");
                }}
                aria-label="Medicine from catalog"
                className="flex-1 min-w-0 min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
              >
                <option value="">Choose a medicine</option>
                {catalog.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setShowAddMedicineModal(false);
                  setShowCatalogForm(true);
                }}
                aria-label="Add medicine to catalog"
                title="Add medicine to catalog"
                className="w-[52px] h-[52px] rounded-xl bg-brand-green text-white flex items-center justify-center flex-shrink-0"
              >
                <Plus size={21} />
              </button>
            </div>
            <input
              required
              value={dosage}
              onChange={(event) => setDosage(event.target.value)}
              placeholder="Dosage, for example 500mg"
              aria-label="Dosage"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <input
              required
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Instructions, for example with breakfast"
              aria-label="Instructions"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <button
              type="submit"
              disabled={!catalogMedicineId}
              className="w-full min-h-[56px] rounded-xl bg-brand-green text-white font-extrabold text-[13px] disabled:opacity-50"
            >
              Add to patient plan
            </button>
          </form>
        </div>
      )}
      {showReminderModal && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reminder-dialog-title"
        >
          <form
            onSubmit={saveReminderWithMedicine}
            className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2
                id="reminder-dialog-title"
                className="font-display italic text-lg font-semibold text-ink"
              >
                Set medicine reminder
              </h2>
              <button
                type="button"
                onClick={() => setShowReminderModal(false)}
                aria-label="Close reminder form"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-ink-soft"
              >
                <X size={20} />
              </button>
            </div>
            <label className="block text-[11px] font-extrabold text-ink-soft">
              Medicine from catalog
              <div className="relative">
                <input
                  required
                  value={reminderMedicineQuery}
                  onChange={(event) => {
                    setReminderMedicineQuery(event.target.value);
                    setSelectedMedicineId("");
                  }}
                  placeholder="Search the medicine catalog"
                  aria-label="Search medicine catalog"
                  className="mt-1 w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
                />
                {reminderMedicineQuery && !selectedMedicineId && (
                  <div className="absolute left-0 right-0 top-[60px] z-10 bg-white border border-brand-green-tint rounded-xl shadow-lg p-1.5">
                    {reminderCatalogResults.length ? (
                      reminderCatalogResults.map((medicine) => (
                        <button
                          type="button"
                          key={medicine.id}
                          onClick={() => {
                            setSelectedMedicineId(medicine.id);
                            setReminderMedicineQuery(medicine.name);
                            setReminderDosage(medicine.commonDosage);
                          }}
                          className="w-full min-h-[48px] px-3 text-left rounded-lg hover:bg-brand-green-tint"
                        >
                          <span className="block text-[13px] font-extrabold text-ink">
                            {medicine.name}
                          </span>
                          <span className="block text-[11px] font-bold text-ink-soft">
                            Common dosage: {medicine.commonDosage}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-[12px] font-bold text-ink-soft">
                        No medicine found in the catalog.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>
            <input
              required
              value={reminderDosage}
              onChange={(event) => setReminderDosage(event.target.value)}
              placeholder="Dosage, for example 500mg"
              aria-label="Reminder dosage"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <input
              required
              value={reminderInstructions}
              onChange={(event) => setReminderInstructions(event.target.value)}
              placeholder="Instructions, for example with breakfast"
              aria-label="Reminder instructions"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <label className="block text-[11px] font-extrabold text-ink-soft">
              Time
              <select
                value={isCustomTime ? 'custom' : selectedTime}
                onChange={(event) => {
                  const value = event.target.value
                  if (value === 'custom') {
                    setIsCustomTime(true)
                    setCustomTime('')
                  } else {
                    setIsCustomTime(false)
                    setSelectedTime(value)
                  }
                }}
                className="mt-1 w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
                <option value="custom">Custom time...</option>
              </select>
              {isCustomTime && (
                <input
                  required
                  type="time"
                  value={customTime}
                  onChange={(event) => setCustomTime(event.target.value)}
                  aria-label="Custom reminder time"
                  className="mt-2 w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
                />
              )}
            </label>
            <button
              type="submit"
              disabled={
                !selectedMedicineId ||
                !reminderDosage.trim() ||
                !reminderInstructions.trim() ||
                (isCustomTime && !customTime)
              }
              className="w-full min-h-[56px] rounded-xl bg-brand-green text-white font-extrabold text-[13px] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Clock3 size={17} />
              Set reminder
            </button>
          </form>
        </div>
      )}
      {showCatalogForm && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalog-dialog-title"
        >
          <form
            onSubmit={addToCatalog}
            className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2
                id="catalog-dialog-title"
                className="font-display italic text-lg font-semibold text-ink"
              >
                Add medicine to catalog
              </h2>
              <button
                type="button"
                onClick={() => setShowCatalogForm(false)}
                aria-label="Close catalog form"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-ink-soft"
              >
                <X size={20} />
              </button>
            </div>
            <p className="m-0 text-[12px] font-bold text-ink-soft">
              Add a medicine name once, so it can be selected for any patient
              later.
            </p>
            <input
              required
              autoFocus
              value={newCatalogName}
              onChange={(event) => setNewCatalogName(event.target.value)}
              placeholder="Medicine name"
              aria-label="Catalog medicine name"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <input
              required
              value={newCatalogDosage}
              onChange={(event) => setNewCatalogDosage(event.target.value)}
              placeholder="Common dosage, for example 500mg"
              aria-label="Common dosage"
              className="w-full min-h-[52px] bg-canvas rounded-xl px-3.5 text-[13px] font-bold text-ink outline-none"
            />
            <button
              type="submit"
              className="w-full min-h-[56px] rounded-xl bg-brand-green text-white font-extrabold text-[13px]"
            >
              Add to catalog
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
