import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Camera, ChevronRight, LockKeyhole, LogOut, ShieldCheck, UserRound, Accessibility } from 'lucide-react';

const DEFAULT_PROFILE = {
  name: 'Pranav',
  email: 'pranav@example.com',
  phone: '+91 98765 43210',
  role: 'patient',
};

function loadProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem('sahayak_current_user') || '{}') };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function PatientSettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(loadProfile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || '');
  const [notifications, setNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    setNotifications(localStorage.getItem('sahayak_notifications') !== 'off');
    setAppointmentReminders(localStorage.getItem('sahayak_appointment_reminders') !== 'off');
    setLargeText(localStorage.getItem('sahayak_large_text') === 'on');
    setHighContrast(localStorage.getItem('sahayak_high_contrast') === 'on');
  }, []);

  const saveProfile = () => {
    const nextProfile = { ...profile, name: name.trim() || profile.name, phone: phone.trim() };
    setProfile(nextProfile);
    localStorage.setItem('sahayak_current_user', JSON.stringify(nextProfile));
    setEditing(false);
  };

  const savePhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const nextProfile = { ...profile, photo: String(reader.result) };
      setProfile(nextProfile);
      localStorage.setItem('sahayak_current_user', JSON.stringify(nextProfile));
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem('sahayak_current_user');
    navigate('/login');
  };

  const setPreference = (key: string, enabled: boolean) => {
    localStorage.setItem(key, enabled ? 'on' : 'off');
  };

  return (
    <div className="min-h-screen bg-[#DDE3D7] p-4 flex items-center justify-center font-sans">
      <style>{`
        .patient-settings-phone {
          width: 100%; max-width: 390px; min-height: 800px; background: #0F1412; border-radius: 46px; padding: 14px; box-shadow: 0 25px 50px rgba(0,0,0,0.28);
        }
        .patient-settings-screen {
          background: #F3F6F0; border-radius: 34px; min-height: 772px; overflow: hidden; position: relative; padding: 0 0 20px 0;
        }
        .patient-settings-notch {
          position: absolute; left: 50%; top: 8px; transform: translateX(-50%); width: 120px; height: 24px; background: #0F1412; border-radius: 20px; z-index: 10;
        }
        .patient-settings-header {
          display: flex; align-items: center; justify-content: space-between; padding: 42px 18px 14px 18px; background: rgba(255,255,255,0.0);
        }
        .back-btn, .lang-btn {
          border: none; border-radius: 14px; background: #E9F0E9; box-shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .back-btn {
          width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .header-title {
          font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 26px; color: #24322A; margin: 0; letter-spacing: -.02em;
        }
        .lang-btn {
          display: flex; align-items: center; gap: 8px; padding: 0 14px; height: 38px; font-weight: 800; color: #3F6B4F; cursor: pointer;
        }
        .section-shell {
          background: rgba(255,255,255,0.0); padding: 0 18px 0 18px; display: flex; flex-direction: column; gap: 12px;
        }
        .profile-card {
          background: #E9F0E9; border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; box-shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .profile-avatar-wrap {
          width: 78px; height: 78px; border-radius: 50%; position: relative; background: #3F6B4F; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 4px solid #DCE6D9;
        }
        .profile-avatar-wrap img {
          width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
        }
        .profile-avatar-wrap .camera-badge {
          position: absolute; right: -2px; bottom: 4px; width: 26px; height: 26px; border-radius: 50%; background: #D98A2B; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid #E9F0E9;
        }
        .profile-info {
          flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px;
        }
        .profile-name {
          font-family: 'Fraunces', serif; font-style: italic; font-weight: 700; font-size: 24px; color: #24322A; line-height: 1.1; margin: 0;
        }
        .profile-email {
          font-size: 12px; color: #5B6A61; font-weight: 700; margin: 0; word-break: break-word;
        }
        .profile-role {
          font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #3F6B4F; font-weight: 900; margin: 0;
        }
        .edit-btn {
          background: transparent; border: none; color: #3F6B4F; font-weight: 900; font-size: 14px; cursor: pointer;
        }
        .panel {
          background: #E9F0E9; border-radius: 18px; overflow: hidden; box-shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .panel-section-label {
          font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5B6A61; font-weight: 900; margin: 18px 0 8px 0; padding: 0 4px;
        }
        .setting-row {
          display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: #E9F0E9; border-bottom: 1px solid rgba(63,107,79,0.12);
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-row .icon { color: #3F6B4F; }
        .setting-row .label { flex: 1; font-size: 16px; font-weight: 800; color: #24322A; }
        .toggle {
          position: relative; width: 40px; height: 22px; border-radius: 999px; background: #CBD4CB; border: none; cursor: pointer; transition: background 0.2s ease;
        }
        .toggle.on { background: #3F6B4F; }
        .toggle .thumb {
          position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: transform 0.2s ease;
        }
        .toggle.on .thumb { transform: translateX(18px); }
        .chevron { color: #5B6A61; }
        .logout-btn {
          margin: 18px 0 0 0; background: #F4D7D8; border: none; color: #B33F33; border-radius: 18px; padding: 16px 18px; font-size: 17px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; width: 100%;
        }
      `}</style>

      <div className="patient-settings-phone">
        <div className="patient-settings-screen">
          <div className="patient-settings-notch" />

          <div className="patient-settings-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <ArrowLeft size={22} strokeWidth={2.6} color="#3F6B4F" />
            </button>
            <h1 className="header-title">Settings</h1>
            <button className="lang-btn" aria-label="Language">
              <span>EN</span>
            </button>
          </div>

          <div className="section-shell">
            <div className="profile-card">
              <div className="profile-avatar-wrap">
                {profile.photo ? <img src={profile.photo} alt="Profile" /> : <UserRound size={36} color="#fff" />}
                <label className="camera-badge" htmlFor="patient-photo-input" title="Change profile picture">
                  <Camera size={12} />
                  <input id="patient-photo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && savePhoto(e.target.files[0])} />
                </label>
              </div>
              <div className="profile-info">
                <p className="profile-name">{profile.name}</p>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-role">{profile.role === 'patient' ? 'Patient account' : 'Caregiver account'}</p>
              </div>
              <button className="edit-btn" onClick={() => setEditing((v) => !v)}>{editing ? 'Close' : 'Edit'}</button>
            </div>

            {editing && (
              <div className="panel" style={{ padding: 16 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-[#F3F6F0] px-3 py-2.5 mb-2 text-[13px] font-bold text-[#24322A] outline-none" placeholder="Full name" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl bg-[#F3F6F0] px-3 py-2.5 text-[13px] font-bold text-[#24322A] outline-none" placeholder="Phone number" />
                <button onClick={saveProfile} className="mt-3 w-full bg-[#3F6B4F] text-white rounded-xl py-2.5 font-extrabold">Save profile</button>
              </div>
            )}

            <div className="panel-section-label">Notifications</div>
            <div className="panel">
              <div className="setting-row">
                <div className="icon"><Bell size={18} /></div>
                <span className="label">Push notifications</span>
                <button type="button" className={`toggle ${notifications ? 'on' : ''}`} onClick={() => { const next = !notifications; setNotifications(next); setPreference('sahayak_notifications', next); }} aria-label="Push notifications">
                  <span className="thumb" />
                </button>
              </div>
              <div className="setting-row">
                <div className="icon"><Bell size={18} /></div>
                <span className="label">Appointment reminders</span>
                <button type="button" className={`toggle ${appointmentReminders ? 'on' : ''}`} onClick={() => { const next = !appointmentReminders; setAppointmentReminders(next); setPreference('sahayak_appointment_reminders', next); }} aria-label="Appointment reminders">
                  <span className="thumb" />
                </button>
              </div>
            </div>

            <div className="panel-section-label">Account and privacy</div>
            <div className="panel">
              <button className="setting-row w-full border-0 bg-transparent text-left" onClick={() => navigate('/patient/reminders')}>
                <div className="icon"><LockKeyhole size={18} /></div>
                <span className="label">Change password</span>
                <ChevronRight size={16} className="chevron" />
              </button>
              <button className="setting-row w-full border-0 bg-transparent text-left" onClick={() => navigate('/patient/family')}>
                <div className="icon"><ShieldCheck size={18} /></div>
                <span className="label">Privacy and data</span>
                <ChevronRight size={16} className="chevron" />
              </button>
              <button className="setting-row w-full border-0 bg-transparent text-left" onClick={() => navigate('/patient/family')}>
                <div className="icon"><UserRound size={18} /></div>
                <span className="label">Care team access</span>
                <ChevronRight size={16} className="chevron" />
              </button>
            </div>

            <div className="panel-section-label">Accessibility</div>
            <div className="panel">
              <div className="setting-row">
                <div className="icon"><Accessibility size={18} /></div>
                <span className="label">Larger text</span>
                <button type="button" className={`toggle ${largeText ? 'on' : ''}`} onClick={() => { const next = !largeText; setLargeText(next); setPreference('sahayak_large_text', next); }} aria-label="Larger text">
                  <span className="thumb" />
                </button>
              </div>
              <div className="setting-row">
                <div className="icon"><ShieldCheck size={18} /></div>
                <span className="label">Stronger contrast</span>
                <button type="button" className={`toggle ${highContrast ? 'on' : ''}`} onClick={() => { const next = !highContrast; setHighContrast(next); setPreference('sahayak_high_contrast', next); }} aria-label="Stronger contrast">
                  <span className="thumb" />
                </button>
              </div>
            </div>

            <button className="logout-btn" onClick={logout}>
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
