import { useState } from 'react';
import type { FormEvent } from 'react';
// Props Interface
interface User {
  name: string;
  email: string;
  password?: string;
}

interface LoginPageProps {
  onLoginSuccess?: (user: User) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
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
      if (onLoginSuccess) {
        onLoginSuccess(matchedUser);
      }
    } else {
      alert("Invalid Email or Password! If you don't have an account, click 'Create New'.");
    }
  };

  return (
    <>
      {subView === 'roles' ? (
        <>
          <div className="top-bar">
            <div className="lang-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M4 5h11M9.5 3v2.2M6 5c0 4 2.5 6.5 6 8M13 5c-.6 3-2 5.5-4.5 7.5M14 21l4-9 4 9M15.6 18h4.8" />
              </svg>
              EN
            </div>
          </div>

          <div className="brand">
            <div className="mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M4.5 20c0-3.6 3-6 7.5-6s7.5 2.4 7.5 6" />
                </svg>
              </div>
              <div className="role-copy">
                <div className="t1">Login as Patient</div>
                <div className="t2">Games, reminders &amp; care in one place</div>
              </div>
              <div className="role-chevron">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            </button>

            <button className="role-btn" onClick={() => alert("Caregiver / ASHA portal...")}>
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            </button>

            <button className="role-btn disabled" aria-disabled="true">
              <div className="role-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z" />
              <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21" />
            </svg>
            <span>Or just say "I'm a patient"</span>
            <span>Or just say "I'm a caretaker"</span>
          </div>

          <div className="footer-note">
            <p>Need help logging in?<br />Ask a family member or your caregiver to assist.</p>
          </div>
        </>
      ) : (
        <>
          <div className="page-header">
            <button className="back-btn" onClick={() => setSubView('roles')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <h1>{isRegistering ? 'Create Account' : 'Patient Login'}</h1>
          </div>

          <div className="brand" style={{ marginTop: '16px' }}>
            <div className="mark" style={{ width: '56px', height: '56px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3.4" />
                <path d="M4.5 20c0-3.6 3-6 7.5-6s7.5 2.4 7.5 6" />
              </svg>
            </div>
            <h1 style={{ fontSize: '24px' }}>{isRegistering ? 'Join Sahayak' : 'Welcome Back'}</h1>
            <p>{isRegistering ? 'Sign up to start your care journey' : 'Enter your credentials to continue'}</p>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {isRegistering && (
              <input
                type="text"
                placeholder="Full Name (e.g. Adesh)"
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
        </>
      )}
    </>
  );
}