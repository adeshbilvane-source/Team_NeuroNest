import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getSupportedLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

export default function PatientHomePage() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [userName, setUserName] = useState<string>('adii');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('home.greetingMorning');
  const [showAllFeatures, setShowAllFeatures] = useState<boolean>(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState<boolean>(false);
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage || i18n.language);

  const handleLanguageSelect = (nextLanguage: typeof currentLanguage) => {
    void changeLanguage(nextLanguage);
    setLanguageMenuOpen(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sahayak_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.name) setUserName(u.name);
      } catch (e) {
        console.error(e);
      }
    }

    const updateTimeAndGreeting = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
      setCurrentDate(now.toLocaleDateString(i18n.language === 'as' ? 'as-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN', options));

      if (hours < 12) setGreeting('home.greetingMorning');
      else if (hours < 17) setGreeting('home.greetingAfternoon');
      else setGreeting('home.greetingEvening');
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 10000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  return (
    <div className="home-root-container">
      <style>{`
        :root {
          --canvas: #F8FAF7; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --white: #FFFFFF; --shadow: 0 8px 24px rgba(36,50,42,0.06);
          --red: #B33F33; --slate: #5B7A9E; --teal: #3F8E82;
        }
        * { box-sizing: border-box; }
        
        .home-root-container {
          display: flex; align-items: center; justify-content: center; min-height: 100vh;
          width: 100%; background: #E1E6DD; padding: 24px; font-family: 'Nunito', sans-serif;
        }
        .phone {
          width: 100%; max-width: 410px; background: #111614; border-radius: 46px;
          padding: 14px; box-shadow: 0 30px 60px rgba(0,0,0,0.35); position: relative;
        }
        .screen {
          background: var(--canvas); border-radius: 34px; overflow: hidden;
          position: relative; height: 860px; display: flex; flex-direction: column;
        }
        
        .scroll-area {
          flex: 1; overflow-y: auto; overflow-x: hidden; scrollbar-width: none;
        }
        .scroll-area::-webkit-scrollbar { display: none; }
        
        .notch {
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
          width: 120px; height: 26px; background: #111614; border-radius: 20px; z-index: 20;
        }

        .header { padding: 48px 24px 0 24px; }
        .top-row { display: flex; justify-content: space-between; align-items: center; }
        .orient { font-weight: 800; color: var(--ink-soft); font-size: 14px; }
        .header-actions { display: flex; align-items: center; gap: 8px; position: relative; }
        .settings-btn {
          width: 34px; height: 34px; border-radius: 10px; background: var(--white);
          display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow);
          border: 1px solid rgba(0,0,0,0.05); cursor: pointer; padding: 0; color: var(--green);
        }
        .settings-btn svg { width: 16px; height: 16px; stroke: var(--green); }
        .lang-wrapper { position: relative; }
        .lang-btn {
          height: 34px; padding: 0 12px; border-radius: 12px; background: var(--white);
          display: flex; align-items: center; gap: 6px; box-shadow: var(--shadow);
          border: 1px solid rgba(0,0,0,0.05); cursor: pointer; font-weight: 800; font-size: 13px; color: var(--green);
        }
        .lang-btn svg { width: 15px; height: 15px; stroke: var(--green); }
        .lang-btn .label { font-size: 12.5px; letter-spacing: 0.02em; }
        .lang-menu {
          position: absolute; top: calc(100% + 8px); right: 0; min-width: 160px;
          background: var(--white); border-radius: 14px; box-shadow: 0 18px 40px rgba(36,50,42,0.14);
          border: 1px solid rgba(0,0,0,0.05); padding: 8px; z-index: 40; display: flex; flex-direction: column; gap: 4px;
        }
        .lang-option {
          width: 100%; border: none; background: transparent; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 8px 10px; color: var(--ink); font-weight: 700; font-size: 13px; cursor: pointer; text-align: left;
        }
        .lang-option:hover { background: #F0F5F0; }
        .lang-option.active { background: #E6F0E9; color: var(--green); }

        .greeting { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 32px; color: var(--ink); margin: 20px 0 0 0; line-height: 1.15; }
        .greeting .name { color: var(--green); font-style: normal; }

        .main-actions { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        
        .action-card {
          position: relative; overflow: hidden; border-radius: 24px; border: none; padding: 18px 20px;
          display: flex; align-items: center; justify-content: flex-start; cursor: pointer; text-align: left;
          box-shadow: 0 12px 24px rgba(0,0,0,0.12); min-height: 120px;
          background-size: cover; background-position: center; background-repeat: no-repeat;
          filter: brightness(1.15) saturate(1.08);
        }
        .action-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(17, 22, 20, 0.30), rgba(17, 22, 20, 0.10));
          z-index: 1;
        }
        
        .card-activity { background-image: linear-gradient(90deg, rgba(18, 28, 23, 0.18), rgba(18, 28, 23, 0.04)), url('/background photos/activity.jpeg'); }
        .card-family { background-image: linear-gradient(90deg, rgba(18, 28, 23, 0.18), rgba(18, 28, 23, 0.04)), url('/background photos/family.jpeg'); }
        .card-videos { background-image: linear-gradient(90deg, rgba(18, 28, 23, 0.18), rgba(18, 28, 23, 0.04)), url('/background photos/videos.jpeg'); }
        
        .card-copy {
          position: relative; z-index: 2; flex: 1; display: flex; align-items: center; min-height: 56px;
        }
        .card-copy .title { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 0.01em; }

        .toggle-link { text-align: center; padding: 6px 0 0 0; }
        .toggle-link a { font-size: 13px; font-weight: 800; color: var(--ink-soft); text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }

        .mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 24px 0 24px; margin-top: 10px; }
        .grid-card {
          position: relative; overflow: hidden; border-radius: 20px; padding: 16px 12px; border: none;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 10px; cursor: pointer;
          box-shadow: var(--shadow); min-height: 120px; background-size: cover; background-position: center; background-repeat: no-repeat;
          filter: brightness(1.12) saturate(1.05);
        }
        .grid-card::before {
          content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(17,22,20,0.12), rgba(17,22,20,0.42));
        }
        .grid-card .icon-img { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid var(--green-tint); display: none; }
        .grid-card .icon-img img { width: 100%; height: 100%; object-fit: cover; }
        .grid-card .title {
          position: relative; z-index: 1; font-weight: 800; font-size: 14px; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .grid-card.reminders { background-image: linear-gradient(180deg, rgba(17,22,20,0.12), rgba(17,22,20,0.42)), url('/background photos/reminder.png'); }
        .grid-card.appointments { background-image: linear-gradient(180deg, rgba(17,22,20,0.12), rgba(17,22,20,0.42)), url('/background photos/appointment.png'); }

        .bottom-spacer { height: 160px; flex-shrink: 0; }
        
        .fixed-bottom {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px; background: linear-gradient(to top, var(--canvas) 60%, rgba(248, 250, 247, 0));
          display: flex; flex-direction: column; align-items: flex-end; z-index: 10; pointer-events: none;
        }
        
        .sos-btn {
          width: 100%; background: var(--red); border: none; border-radius: 24px; padding: 18px 20px;
          display: flex; align-items: center; gap: 16px; box-shadow: 0 12px 24px rgba(179,63,51,0.35); pointer-events: auto; cursor: pointer;
        }
        .sos-icon {
          width: 46px; height: 46px; border-radius: 50%; background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sos-icon svg { width: 24px; height: 24px; stroke: #fff; }
        .sos-copy { text-align: left; }
        .sos-copy .t1 { font-size: 18px; font-weight: 900; color: #fff; }
        .sos-copy .t2 { font-size: 12.5px; font-weight: 700; color: #F6D9D4; margin-top: 2px; }
      `}</style>

      <div className="phone">
        <div className="screen">
          <div className="notch"></div>
          
          <div className="scroll-area">
            <div className="header">
              <div className="top-row">
                <div className="orient">{currentDate} - {currentTime}</div>
                <div className="header-actions">
                  <button className="settings-btn" onClick={() => navigate('/patient/settings')} aria-label="Settings">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3.2" />
                      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.82 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .99 1.7 1.7 0 0 0-.2 1.1V22a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.2-1.1 1.7 1.7 0 0 0-1-.99 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.82l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.99-1 1.7 1.7 0 0 0-1.1-.2H2.4a2 2 0 1 1 0-4h.09c.4 0 .8-.07 1.1-.2a1.7 1.7 0 0 0 .99-1A1.7 1.7 0 0 0 4.6 7.8l-.06-.06A2 2 0 1 1 7.36 4.9l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.99 1.7 1.7 0 0 0 .2-1.1V2.4a2 2 0 1 1 4 0v.09c0 .4.07.8.2 1.1.17.4.48.73.99 1a1.7 1.7 0 0 0 1.86-.34l.06-.06A2 2 0 1 1 19.1 7.36l-.06.06A1.7 1.7 0 0 0 19.4 9c.4.3.68.7.8 1.14.12.4.2.8.2 1.1v.09a2 2 0 1 1 0 4h-.09c-.4 0-.8.07-1.1.2-.43.12-.84.4-1.14.8Z"/>
                    </svg>
                  </button>
                  <div className="lang-wrapper">
                    <button className="lang-btn" aria-label="Language" onClick={() => setLanguageMenuOpen((open) => !open)}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5h11M9.5 3v2.2M6 5c0 4 2.5 6.5 6 8M13 5c-.6 3-2 5.5-4.5 7.5M14 21l4-9 4 9M15.6 18h4.8"/>
                      </svg>
                      <span className="label">{currentLanguage.toUpperCase()}</span>
                    </button>
                    {languageMenuOpen && (
                      <div className="lang-menu" role="menu" aria-label="Select language">
                        {SUPPORTED_LANGUAGES.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`lang-option ${currentLanguage === option ? 'active' : ''}`}
                            onClick={() => handleLanguageSelect(option)}
                          >
                            <span>{option.toUpperCase()}</span>
                            <span>{option === 'en' ? 'English' : option === 'es' ? 'Español' : option === 'as' ? 'অসমীয়া' : 'हिन्दी'}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="greeting">{t(greeting)},<br /><span className="name">{userName}</span> 🌻</div>

            </div>

            <div className="main-actions">
              <button className="action-card card-activity" onClick={() => navigate('/patient/activities')}>
                <div className="card-copy">
                  <div className="title">{t('nav.activity')}</div>
                </div>
              </button>

              <button className="action-card card-family" onClick={() => navigate('/patient/family')}>
                <div className="card-copy">
                  <div className="title">{t('nav.family')}</div>
                </div>
              </button>

              <button className="action-card card-videos" onClick={() => navigate('/patient/videos-library')}>
                <div className="card-copy">
                  <div className="title">{t('nav.videos')}</div>
                </div>
              </button>
            </div>

            <div className="toggle-link">
              <a onClick={() => setShowAllFeatures(!showAllFeatures)}>{showAllFeatures ? t('home.hideFeatures') : t('home.allFeatures')}</a>
            </div>

            {showAllFeatures && (
              <div className="mini-grid">
                <button className="grid-card reminders" onClick={() => navigate('/patient/reminders')}>
                  <div className="icon-img"><img src="/patients_pp/patient4.jpg" alt={t('nav.reminders')} onError={(e) => (e.currentTarget.style.display = 'none')} /></div>
                  <div className="title">{t('nav.reminders')}</div>
                </button>
                <button className="grid-card appointments" onClick={() => navigate('/patient/appointments')}>
                  <div className="icon-img"><img src="/patients_pp/patient6.jpeg" alt={t('nav.appointments')} onError={(e) => (e.currentTarget.style.display = 'none')} /></div>
                  <div className="title">{t('nav.appointments')}</div>
                </button>
              </div>
            )}

            <div className="bottom-spacer"></div>
          </div>

          <div className="fixed-bottom">
            <button className="sos-btn" onClick={() => navigate('/patient/emergency')}>
              <div className="sos-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 1.9h2.6a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L7.6 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z"/>
                </svg>
              </div>
              <div className="sos-copy">
                <div className="t1">Emergency — Call Now</div>
                <div className="t2">Alerts family instantly with your location</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}