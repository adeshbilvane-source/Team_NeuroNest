import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, Camera, ChevronRight, LockKeyhole, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../components/Toast'

type CaregiverProfile = {
  name: string
  email: string
  phone?: string
  role?: 'patient' | 'caregiver'
  photo?: string
}

const DEFAULT_PROFILE: CaregiverProfile = {
  name: 'Caregiver',
  email: 'caregiver@example.com',
  role: 'caregiver',
}

function loadProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('sahayak_current_user') || '{}') } as CaregiverProfile
  } catch {
    return DEFAULT_PROFILE
  }
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CaregiverProfile>(loadProfile)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone || '')
  const [notifications, setNotifications] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)

  useEffect(() => {
    setNotifications(localStorage.getItem('sahayak_notifications') !== 'off')
    setAppointmentReminders(localStorage.getItem('sahayak_appointment_reminders') !== 'off')
  }, [])

  const saveProfile = () => {
    const nextProfile = { ...profile, name: name.trim() || profile.name, phone: phone.trim() }
    setProfile(nextProfile)
    localStorage.setItem('sahayak_current_user', JSON.stringify(nextProfile))
    const users = JSON.parse(localStorage.getItem('sahayak_users') || '[]') as CaregiverProfile[]
    localStorage.setItem('sahayak_users', JSON.stringify(users.map((user) => user.email === nextProfile.email ? nextProfile : user)))
    setEditing(false)
    showToast('Your profile has been updated.')
  }

  const savePhoto = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const nextProfile = { ...profile, photo: String(reader.result) }
      setProfile(nextProfile)
      localStorage.setItem('sahayak_current_user', JSON.stringify(nextProfile))
    }
    reader.readAsDataURL(file)
  }

  const logout = () => {
    localStorage.removeItem('sahayak_current_user')
    navigate('/login')
  }

  const setNotificationPreference = (key: string, enabled: boolean) => {
    localStorage.setItem(key, enabled ? 'on' : 'off')
  }

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} />
        </button>
        <h1 className="font-display italic font-semibold text-xl text-ink">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        <section className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              {profile.photo ? <img src={profile.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center"><UserRound size={29} /></div>}
              <label htmlFor="profile-photo" className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-marigold text-white flex items-center justify-center cursor-pointer" title="Change profile photo">
                <Camera size={14} />
                <input id="profile-photo" type="file" accept="image/*" className="sr-only" onChange={(event) => event.target.files?.[0] && savePhoto(event.target.files[0])} />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="m-0 font-display italic text-lg text-ink truncate">{profile.name}</h2>
              <p className="m-0 mt-0.5 text-[11.5px] text-ink-soft font-bold truncate">{profile.email}</p>
              <p className="m-0 mt-1 text-[10.5px] text-brand-green font-extrabold uppercase">Caregiver account</p>
            </div>
            <button onClick={() => setEditing((value) => !value)} className="text-brand-green font-extrabold text-[12px]">{editing ? 'Close' : 'Edit'}</button>
          </div>

          {editing && (
            <div className="mt-4 pt-4 border-t border-brand-green-tint space-y-2.5">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full bg-canvas rounded-xl px-3.5 py-3 text-[13px] font-bold text-ink outline-none" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" type="tel" className="w-full bg-canvas rounded-xl px-3.5 py-3 text-[13px] font-bold text-ink outline-none" />
              <button onClick={saveProfile} className="w-full bg-brand-green text-white rounded-xl py-3 font-extrabold text-[13px]">Save profile</button>
            </div>
          )}
        </section>

        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">Notifications</div>
        <section className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <SettingToggle icon={<Bell size={18} />} label="Push notifications" value={notifications} onChange={(value) => { setNotifications(value); setNotificationPreference('sahayak_notifications', value) }} />
          <SettingToggle icon={<Bell size={18} />} label="Appointment reminders" value={appointmentReminders} onChange={(value) => { setAppointmentReminders(value); setNotificationPreference('sahayak_appointment_reminders', value) }} last />
        </section>

        <div className="text-[12px] font-black text-ink-soft uppercase tracking-wide mb-2.5">Account and privacy</div>
        <section className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <SettingLink icon={<LockKeyhole size={18} />} label="Change password" onClick={() => showToast('Password reset instructions are ready to send.', 'info')} />
          <SettingLink icon={<ShieldCheck size={18} />} label="Privacy and data" onClick={() => showToast('Your care data is protected and shared only with your care team.', 'info')} />
          <SettingLink icon={<UserRound size={18} />} label="Care team access" onClick={() => showToast('Care team access settings are ready to connect.', 'info')} last />
        </section>

        <button onClick={logout} className="w-full bg-red-tint text-alert-red rounded-2xl py-3.5 font-extrabold text-[13px] flex items-center justify-center gap-2">
          <LogOut size={17} /> Log out
        </button>
      </div>
    </div>
  )
}

function SettingToggle({ icon, label, value, onChange, last = false }: { icon: React.ReactNode; label: string; value: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return <div className={`px-3.5 py-3 flex items-center gap-3 ${last ? '' : 'border-b border-brand-green-tint'}`}><div className="text-brand-green">{icon}</div><span className="flex-1 text-[13px] font-extrabold text-ink">{label}</span><button type="button" onClick={() => onChange(!value)} aria-label={`${label} ${value ? 'on' : 'off'}`} className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-brand-green' : 'bg-[#C7D3C9]'}`}><span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
}

function SettingLink({ icon, label, onClick, last = false }: { icon: React.ReactNode; label: string; onClick: () => void; last?: boolean }) {
  return <button onClick={onClick} className={`w-full px-3.5 py-3 flex items-center gap-3 text-left ${last ? '' : 'border-b border-brand-green-tint'}`}><div className="text-brand-green">{icon}</div><span className="flex-1 text-[13px] font-extrabold text-ink">{label}</span><ChevronRight size={16} className="text-ink-soft" /></button>
}
