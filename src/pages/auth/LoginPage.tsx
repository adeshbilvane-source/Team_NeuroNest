import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface User {
  name: string;
  email: string;
  password?: string;
  role?: 'patient' | 'caregiver';
}

function loadUsers(): User[] {
  try {
    const storedUsers: unknown = JSON.parse(localStorage.getItem('sahayak_users') || '[]');
    return Array.isArray(storedUsers) ? storedUsers as User[] : [];
  } catch {
    return [];
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [subView, setSubView] = useState<'roles' | 'auth_form'>('roles');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'patient' | 'caregiver'>('patient');

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegistering) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        alert(t('auth.fillRequired'));
        return;
      }

      const existingUsers = loadUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const userExists = existingUsers.some((u: User) => String(u.email || '').trim().toLowerCase() === normalizedEmail);

      if (userExists) {
        alert(t('auth.accountExists'));
        setIsRegistering(false);
        return;
      }

      const newUser: User = { 
        name: fullName.trim(), 
        email: email.trim().toLowerCase(), 
        password: password.trim(),
        role,
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('sahayak_users', JSON.stringify(existingUsers));
      localStorage.setItem('sahayak_current_user', JSON.stringify(newUser));

      alert(t('auth.accountCreated'));
      setIsRegistering(false);
      setPassword('');
      return;
    }

    if (!email.trim() || !password.trim()) {
      alert(t('auth.enterCredentials'));
      return;
    }

    const registeredUsers = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const matchedUser = registeredUsers.find(
      (u: User) => String(u.email || '').trim().toLowerCase() === normalizedEmail
        && String(u.password || '') === normalizedPassword
        && (role === 'caregiver'
          ? String(u.role || '').toLowerCase() === 'caregiver'
          : String(u.role || '').toLowerCase() !== 'caregiver')
    );

    if (matchedUser) {
      localStorage.setItem('sahayak_current_user', JSON.stringify(matchedUser));
      navigate(matchedUser.role === 'caregiver' ? '/doctor' : '/patient');
    } else {
      alert(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="login-root-container app-page-enter">
      <style>{`
        :root {
          --canvas: #F3F6F0;
          --ink: #24322A;
          --ink-soft: #5B6A61;
          --green: #3F6B4F;
          --green-tint: #E3EDE5;
          --marigold: #D98A2B;
          --white: #FFFFFF;
          --shadow: 0 6px 16px rgba(36, 50, 42, 0.08);
        }
        .login-root-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          background: #DCE3D6;
          padding: 16px;
          box-sizing: border-box;
          font-family: 'Nunito', sans-serif;
        }
        .phone-wrapper {
          width: 100%;
          max-width: 390px;
          background: #111614;
          border-radius: 46px;
          padding: 14px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
          box-sizing: border-box;
        }
        .phone-screen {
          background: var(--canvas);
          border-radius: 34px;
          overflow: hidden;
          position: relative;
          min-height: 780px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .notch {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 24px;
          background: #111614;
          border-radius: 20px;
          z-index: 10;
        }
        .top-bar { display: flex; justify-content: flex-end; padding: 44px 22px 0 22px; }
        .lang-pill {
          height: 40px; padding: 0 14px; border-radius: 13px; background: var(--white);
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 6px;
          font-weight: 800; font-size: 13px; color: var(--green); cursor: pointer;
        }
        .brand { text-align: center; margin-top: 36px; padding: 0 26px; }
        .brand .mark {
          width: 74px; height: 74px; margin: 0 auto 12px auto; border-radius: 22px;
          background: var(--green); display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: var(--shadow);
        }
        .brand .mark img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .brand h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 30px; color: var(--ink); margin: 0; }
        .brand p { font-size: 13.5px; color: var(--ink-soft); font-weight: 700; margin: 6px 0 0 0; }

        .role-list { padding: 34px 22px 0 22px; display: flex; flex-direction: column; gap: 14px; }
        .role-btn {
          display: flex; align-items: center; gap: 16px; width: 100%;
          background: var(--white); border: none; border-radius: 20px; padding: 18px;
          box-shadow: var(--shadow); cursor: pointer; text-align: left; transition: transform 0.15s ease;
          box-sizing: border-box;
        }
        .role-btn:active { transform: scale(0.98); }
        .role-icon {
          width: 52px; height: 52px; min-width: 52px;
          border-radius: 16px; background: var(--green-tint); display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 2px solid var(--green-tint);
        }
        .role-icon img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .role-copy { display: flex; flex-direction: column; }
        .role-copy .t1 { font-size: 17px; font-weight: 800; color: var(--ink); }
        .role-copy .t2 { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); margin-top: 2px; }
        .role-chevron { margin-left: auto; display: flex; align-items: center; }

        .role-btn.disabled { background: #EDEFEA; cursor: not-allowed; box-shadow: none; opacity: 0.72; }
        .role-btn.disabled .role-icon { background: #E1E4DC; }
        .role-btn.disabled .role-chevron { display: none; }
        .soon-pill {
          font-size: 10.5px; font-weight: 900; letter-spacing: 0.4px; color: #7C8479;
          background: #DFE3D8; padding: 3px 9px; border-radius: 20px; margin-left: auto; text-transform: uppercase;
        }

        .voice-hint {
          margin: 22px 22px 0 22px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .voice-hint span { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); }
        .footer-note { margin-top: auto; padding: 20px 30px 30px 30px; text-align: center; }
        .footer-note p { font-size: 12px; font-weight: 700; color: var(--ink-soft); line-height: 1.5; margin: 0; }

        .auth-container { padding: 52px 22px 30px 22px; display: flex; flex-direction: column; flex: 1; box-sizing: border-box; }
        .auth-header-card {
          background: var(--white); border-radius: 20px; padding: 14px 18px;
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .auth-header-card h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .auth-form { display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box; }
        .auth-form input {
          width: 100%; padding: 16px 18px; border-radius: 20px; border: none;
          background: var(--white); box-shadow: var(--shadow); font-size: 15px;
          font-family: inherit; font-weight: 700; color: var(--ink); outline: none; box-sizing: border-box;
          position: relative; z-index: 1; pointer-events: auto; user-select: text;
        }
        .auth-btn {
          background: var(--green); color: #fff; border: none; border-radius: 20px;
          padding: 16px; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 6px;
          box-shadow: 0 8px 20px rgba(63, 107, 79, 0.3);
        }
        .toggle-auth { text-align: center; font-size: 13.5px; color: var(--ink-soft); font-weight: 700; margin-top: 10px; cursor: pointer; }
        .toggle-auth span { color: var(--green); font-weight: 900; }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          {subView === 'roles' ? (
            <>
              <div className="brand app-reveal">
                <div className="mark">
                  <img src="/favicon.png" alt="Sahayak logo" />
                </div>
                <h1>Sahayak</h1>
                <p>{t('auth.tagline')}</p>
              </div>

              <div className="role-list">
                <button className="role-btn app-reveal app-delay-1" onClick={() => { setRole('patient'); setIsRegistering(false); setSubView('auth_form'); }}>
                  <div className="role-icon">
                    <img src="/patient.jpg" alt={t('auth.loginPatient')} />
                  </div>
                  <div className="role-copy">
                    <div className="t1">{t('auth.loginPatient')}</div>
                    <div className="t2">{t('auth.patientDescription')}</div>
                  </div>
                  <div className="role-chevron">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </button>

                <button className="role-btn app-reveal app-delay-2" onClick={() => { setRole('caregiver'); setIsRegistering(false); setSubView('auth_form'); }}>
                  <div className="role-icon">
                    <img src="/doctor.jpg" alt={t('auth.loginCaregiver')} />
                  </div>
                  <div className="role-copy">
                    <div className="t1">{t('auth.loginCaregiver')}</div>
                    <div className="t2">{t('auth.caregiverDescription')}</div>
                  </div>
                  <div className="role-chevron">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </button>

                <button className="role-btn disabled app-reveal app-delay-3" aria-disabled="true">
                  <div className="role-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8A9188" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8.5" cy="8" r="2.7" />
                      <circle cx="16" cy="9" r="2.2" />
                      <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5M14.3 19c0-2.2 1.5-3.8 3.4-3.8s3.3 1.6 3.3 3.8" />
                    </svg>
                  </div>
                  <div className="role-copy">
                    <div className="t1">{t('auth.loginFamily')}</div>
                    <div className="t2">{t('auth.familyDescription')}</div>
                  </div>
                  <div className="soon-pill">{t('auth.comingSoon')}</div>
                </button>
              </div>

              <div className="footer-note">
                <p>{t('auth.helpLogin')}<br />{t('auth.helpLoginDescription')}</p>
              </div>
            </>
          ) : (
            <div className="auth-container">
              <div className="auth-header-card">
                <button className="back-btn" onClick={() => setSubView('roles')}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <h1>{isRegistering ? t('auth.createAccount') : t('auth.loginTitle', { role: role === 'caregiver' ? t('auth.caregiver') : t('auth.patient') })}</h1>
              </div>

              <div className="brand app-reveal" style={{ marginTop: '0', marginBottom: '20px', padding: 0 }}>
                <div className="mark">
                  <img src="/favicon.png" alt="Sahayak logo" />
                </div>
                <h1>{isRegistering ? t('auth.joinAs', { role: role === 'caregiver' ? t('auth.caregiver') : t('auth.patient') }) : t('auth.welcomeBack')}</h1>
                <p>{isRegistering ? t('auth.signUpDescription') : t('auth.loginDescription')}</p>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {isRegistering && (
                  <input
                    type="text"
                    placeholder={t('auth.fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="auth-btn">
                  {isRegistering ? t('auth.createAccount') : t('auth.logIn')}
                </button>

                <div
                  className="toggle-auth"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setPassword('');
                  }}
                >
                  {isRegistering ? (
                    <>{t('auth.alreadyAccount')} <span>{t('auth.login')}</span></>
                  ) : (
                    <>{t('auth.noAccount')} <span>{t('auth.createNew')}</span></>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}