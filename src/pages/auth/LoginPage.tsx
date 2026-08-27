import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<'roles' | 'auth_form'>('roles');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRegistering) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        alert("Please fill all required fields!");
        return;
      }

      const existingUsers: User[] = JSON.parse(localStorage.getItem('sahayak_users') || '[]');
      const userExists = existingUsers.some((u: User) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (userExists) {
        alert("An account with this email already exists! Please login instead.");
        setIsRegistering(false);
        return;
      }

      const newUser: User = { 
        name: fullName.trim(), 
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('sahayak_users', JSON.stringify(existingUsers));
      localStorage.setItem('sahayak_current_user', JSON.stringify(newUser));

      alert("Account created successfully! Please login with your credentials.");
      setIsRegistering(false);
      setPassword('');
      return;
    }

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    const registeredUsers: User[] = JSON.parse(localStorage.getItem('sahayak_users') || '[]');
    const matchedUser = registeredUsers.find(
      (u: User) => u.email === email.trim().toLowerCase() && u.password === password.trim()
    );

    if (matchedUser) {
      localStorage.setItem('sahayak_current_user', JSON.stringify(matchedUser));
      navigate('/patient'); // Route to Patient Home
    } else {
      alert("Invalid Email or Password! If you don't have an account, click 'Create New'.");
    }
  };

  return (
    <div className="login-root-container">
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
        .brand { text-align: center; margin-top: 20px; padding: 0 26px; }
        .brand .mark {
          width: 74px; height: 74px; margin: 0 auto 12px auto; border-radius: 22px;
          background: var(--green); display: flex; align-items: center; justify-content: center;
        }
        .brand h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 30px; color: var(--ink); margin: 0; }
        .brand p { font-size: 13.5px; color: var(--ink-soft); font-weight: 700; margin: 6px 0 0 0; }

        .role-list { padding: 30px 22px 0 22px; display: flex; flex-direction: column; gap: 14px; }
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

        .auth-container { padding: 44px 22px 30px 22px; display: flex; flex-direction: column; flex: 1; box-sizing: border-box; }
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
              <div className="top-bar">
                <div className="lang-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M4 5h11M9.5 3v2.2M6 5c0 4 2.5 6.5 6 8M13 5c-.6 3-2 5.5-4.5 7.5M14 21l4-9 4 9M15.6 18h4.8" />
                  </svg>
                  EN
                </div>
              </div>

              <div className="brand">
                <div className="mark">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.5c-4 2-7 3-7 8 0 5 4 8.5 7 9 3-.5 7-4 7-9 0-5-3-6-7-8Z" />
                    <path d="M9.2 12.3l1.9 1.9 3.7-3.9" />
                  </svg>
                </div>
                <h1>Sahayak</h1>
                <p>Cognitive care, made simple</p>
              </div>

              <div className="role-list">
                <button className="role-btn" onClick={() => { setIsRegistering(false); setSubView('auth_form'); }}>
                  <div className="role-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.4" />
                      <path d="M4.5 20c0-3.6 3-6 7.5-6s7.5 2.4 7.5 6" />
                    </svg>
                  </div>
                  <div className="role-copy">
                    <div className="t1">Login as Patient</div>
                    <div className="t2">Games, reminders &amp; care in one place</div>
                  </div>
                  <div className="role-chevron">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </button>

                <button className="role-btn" onClick={() => navigate('/doctor')}>
                  <div className="role-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3v6.5a4.5 4.5 0 0 0 9 0V5" />
                      <circle cx="18.5" cy="7" r="1.6" />
                      <path d="M10.5 13.5V16a5.5 5.5 0 0 0 11 0v-1.2" />
                    </svg>
                  </div>
                  <div className="role-copy">
                    <div className="t1">Login as Caregiver</div>
                    <div className="t2">Monitor patients &amp; manage appointments</div>
                  </div>
                  <div className="role-chevron">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </button>

                <button className="role-btn disabled" aria-disabled="true">
                  <div className="role-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8A9188" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8.5" cy="8" r="2.7" />
                      <circle cx="16" cy="9" r="2.2" />
                      <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5M14.3 19c0-2.2 1.5-3.8 3.4-3.8s3.3 1.6 3.3 3.8" />
                    </svg>
                  </div>
                  <div className="role-copy">
                    <div className="t1">Login as Family Member</div>
                    <div className="t2">Stay updated on a loved one's care</div>
                  </div>
                  <div className="soon-pill">Coming soon</div>
                </button>
              </div>

              <div className="voice-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--marigold)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z" />
                  <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21" />
                </svg>
                <span>Or just say "I'm a patient"</span>
              </div>

              <div className="footer-note">
                <p>Need help logging in?<br />Ask a family member or your caregiver to assist.</p>
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
                <h1>{isRegistering ? 'Create Account' : 'Patient Login'}</h1>
              </div>

              <div className="brand" style={{ marginTop: '0', marginBottom: '20px', padding: 0 }}>
                <div className="mark">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.4" />
                    <path d="M4.5 20c0-3.6 3-6 7.5-6s7.5 2.4 7.5 6" />
                  </svg>
                </div>
                <h1>{isRegistering ? 'Join Sahayak' : 'Welcome Back'}</h1>
                <p>{isRegistering ? 'Sign up to start your care journey' : 'Enter your credentials to continue'}</p>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {isRegistering && (
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Adesh Bilvane )"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="auth-btn">
                  {isRegistering ? 'Create Account' : 'Log In'}
                </button>

                <div
                  className="toggle-auth"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setPassword('');
                  }}
                >
                  {isRegistering ? (
                    <>Already have an account? <span>Login</span></>
                  ) : (
                    <>Don't have an account? <span>Create New</span></>
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