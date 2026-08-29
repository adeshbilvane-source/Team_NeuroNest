import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSupportedLanguage } from '../../i18n';
import { getVoiceLocale } from '../../i18n/voiceLocale';

export default function PatientHomePage() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [userName, setUserName] = useState<string>('adii');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('home.greetingMorning');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>(() => t('home.voiceExamples'));
  const [showAllFeatures, setShowAllFeatures] = useState<boolean>(false);

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

  useEffect(() => {
    if (!isListening) setVoiceFeedback(t('home.voiceExamples'));
  }, [i18n.language, isListening, t]);

  const handleLogout = () => {
    localStorage.removeItem('sahayak_current_user');
    navigate('/login');
  };

  const startVoiceAssistant = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getVoiceLocale(getSupportedLanguage(i18n.language));
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceFeedback(`${t('home.listening')} ${t('home.tapAndSpeak')}`);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceFeedback(`Heard: "${transcript}"`);
      setIsListening(false);

      if (transcript.includes('game') || transcript.includes('play')) {
        navigate('/patient/games');
      } else if (transcript.includes('analytics') || transcript.includes('graph') || transcript.includes('time')) {
        navigate('/patient/analytics');
      } else if (transcript.includes('yoga') || transcript.includes('exercise')) {
        navigate('/patient/yoga');
      } else if (transcript.includes('reminder') || transcript.includes('medicine')) {
        navigate('/patient/reminders');
      } else if (transcript.includes('family') || transcript.includes('call my') || transcript.includes('son') || transcript.includes('daughter')) {
        navigate('/patient/family');
      } else if (transcript.includes('video') || transcript.includes('photo')) {
        navigate('/patient/videos-library');
      } else if (transcript.includes('help') || transcript.includes('chat')) {
        navigate('/patient/chat');
      } else if (transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('doctor')) {
        navigate('/patient/emergency');
      } else if (transcript.includes('logout')) {
        handleLogout();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceFeedback(t('home.voiceExamples'));
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="home-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --marigold: #8A5A1C;
          --red: #B33F33; --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --blue: #3E7FB8; --blue-dark: #2C5F8A; --teal: #3F8E82; --slate: #5B7A9E;
        }
        .home-root-container {
          display: flex; align-items: center; justify-content: center; min-height: 100vh;
          width: 100%; background: #DCE3D6; padding: 24px; box-sizing: border-box; font-family: 'Nunito', sans-serif;
        }
        .phone-wrapper {
          width: 100%; max-width: 390px; background: #111614; border-radius: 46px;
          padding: 14px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35); box-sizing: border-box;
        }
        .phone-screen {
          background: var(--canvas); border-radius: 34px; overflow: hidden;
          position: relative; min-height: 780px; display: flex; flex-direction: column; box-sizing: border-box;
        }
        .notch {
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
          width: 120px; height: 24px; background: #111614; border-radius: 20px; z-index: 10;
        }
        .header { padding: 48px 24px 16px 24px; }
        .top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .orient { font-weight: 800; color: var(--ink-soft); font-size: 13.5px; letter-spacing: 0.2px; }
        .orient .time { color: var(--green); font-size: 13.5px; margin-left: 4px; }
        
        .icon-row { display: flex; align-items: center; gap: 16px; }
        .lang-pill {
          min-height: 56px; padding: 0 16px; border-radius: 16px; background: var(--white);
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 5px;
          font-weight: 800; font-size: 12.5px; color: var(--green); cursor: pointer; border: none;
        }
        .icon-btn {
          width: 56px; height: 56px; border-radius: 16px; background: var(--white);
          display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow); border: none; cursor: pointer; flex-shrink: 0;
        }

        .greeting { font-family: 'Fraunces', serif; font-weight: 600; font-style: italic; color: var(--ink); font-size: 30px; line-height: 1.2; margin: 24px 0 0 0; }
        .greeting .name { color: var(--green); font-style: normal; }
        .voice-row {
          display: flex; align-items: center; gap: 16px; margin-top: 24px; width: 100%; background: var(--white);
          border: 2px solid transparent; border-radius: 24px; padding: 16px; box-shadow: var(--shadow); cursor: pointer;
          text-align: left; transition: transform 180ms ease, border-color 180ms ease;
        }
        .voice-row:focus-visible { outline: 4px solid #7A4D00; outline-offset: 3px; border-color: var(--marigold); }
        .voice-row:active, .card:active, .banner-slide:active, .sos-btn:active { transform: scale(0.98); }
        .mic-btn {
          width: 56px; height: 56px; min-width: 56px; border-radius: 50%; background: var(--marigold);
          display: flex; align-items: center; justify-content: center; position: relative; border: none; cursor: pointer;
        }
        .mic-ring {
          position: absolute; inset: -5px; border-radius: 50%; border: 2px solid var(--marigold);
          opacity: 0.55; animation: pulse 2.4s ease-out infinite;
        }
        .listening .mic-btn { background: var(--red); }
        .listening .mic-ring { border-color: var(--red); animation: pulse 1s ease-out infinite; }
        @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.55; } 70% { transform: scale(1.35); opacity: 0; } 100% { opacity: 0; } }
        .voice-text { flex: 1; }
        .voice-text .t1 { font-weight: 800; font-size: 14px; color: var(--ink); }
        .voice-text .t2 { font-weight: 600; font-size: 12px; color: var(--ink-soft); margin-top: 2px; }

<<<<<<< HEAD
        .games-banner {
          margin: 14px 20px 0 20px; width: calc(100% - 40px); border: none; border-radius: 20px; padding: 16px 18px;
          background: linear-gradient(135deg, var(--green) 0%, #345943 100%); box-shadow: 0 10px 22px rgba(63,107,79,0.35);
          display: flex; align-items: center; gap: 14px; cursor: pointer; text-align: left; box-sizing: border-box;
=======
        .banner-carousel-wrapper {
          margin: 16px 24px 0 24px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
>>>>>>> 56b9dffd5330522d3546cc53c1af924451b5831e
        }
        .games-banner-icon {
          width: 46px; height: 46px; min-width: 46px; border-radius: 14px; background: rgba(255,255,255,0.18); overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
<<<<<<< HEAD
        .games-banner-icon img { width: 100%; height: 100%; object-fit: cover; }
        .games-banner-copy .label { font-size: 10.5px; font-weight: 800; letter-spacing: 0.4px; color: #CFE3D6; text-transform: uppercase; }
        .games-banner-copy .main { font-size: 16px; font-weight: 800; color: #fff; margin-top: 2px; line-height: 1.25; }
        .games-banner-chevron { margin-left: auto; display: flex; align-items: center; }

        .priority-actions { margin: 20px 20px 0 20px; display: flex; flex-direction: column; gap: 14px; }
        .priority-btn {
          display: flex; align-items: center; gap: 16px; border: none; border-radius: 22px; padding: 18px 20px; cursor: pointer;
          text-align: left; box-shadow: 0 10px 20px rgba(0,0,0,0.12); width: 100%; box-sizing: border-box;
        }
        .priority-btn.games { background: var(--green); }
        .priority-btn.videos { background: var(--teal); }
        .priority-btn.emergency { background: var(--slate); }
        .priority-icon {
          width: 50px; height: 50px; min-width: 50px; border-radius: 16px; background: rgba(255,255,255,0.2); overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .priority-icon img { width: 100%; height: 100%; object-fit: cover; }
        .priority-copy .t1 { font-size: 17px; font-weight: 800; color: #fff; }
        .priority-copy .t2 { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8); margin-top: 2px; }

        .see-all { text-align: center; margin-top: 16px; }
        .see-all a { font-size: 12.5px; font-weight: 800; color: var(--ink-soft); text-decoration: underline; cursor: pointer; }
        .feature-list {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 20px 0 20px;
        }
        .feature-mini-card {
          background: var(--white); border: none; border-radius: 14px; padding: 12px 10px; box-shadow: var(--shadow);
          display: flex; flex-direction: column; align-items: center; gap: 8px; font-weight: 800; color: var(--ink); cursor: pointer;
        }
        .feature-mini-card img { width: 22px; height: 22px; object-fit: cover; border-radius: 8px; }
        .feature-mini-card span { font-size: 12px; }

        .help-floating {
          position: absolute; right: 18px; bottom: 94px; width: 48px; height: 48px; border-radius: 50%; background: var(--green); border: none; box-shadow: 0 12px 20px rgba(63,107,79,0.22); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 20;
        }
=======
        .banner-slide {
          width: 50%;
          border-radius: 20px;
          min-height: 88px; padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          border: none;
          box-sizing: border-box;
          text-align: left;
          user-select: none;
        }
        .banner-reminder {
          background: linear-gradient(135deg, var(--green) 0%, #345943 100%);
          box-shadow: 0 10px 22px rgba(63,107,79,0.35);
        }
        .banner-analytics {
          background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
          box-shadow: 0 10px 22px rgba(62,127,184,0.35);
        }
        .banner-icon {
          width: 44px; height: 44px; border-radius: 14px; background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px;
        }
        .banner-copy .label { font-size: 11px; font-weight: 800; letter-spacing: 0.6px; color: #CFE3D6; text-transform: uppercase; }
        .banner-copy .main { font-size: 15px; font-weight: 800; color: #fff; margin-top: 2px; }
        .banner-analytics .label { color: #CFE2F2; }
        .banner-chevron { margin-left: auto; display: flex; align-items: center; }

        .carousel-dots {
          display: flex; justify-content: center; gap: 16px; margin-top: 16px; margin-bottom: 8px;
        }
        .dot {
          width: 56px; height: 12px; border: 0; border-radius: 10px; background: #C7D3C9; transition: all 0.2s ease; cursor: pointer;
        }
        .dot.active { background: var(--green); }

        .grid { margin: 16px 24px 0 24px; display: flex; flex-direction: column; gap: 16px; }
        .card {
          background: var(--green-tint); border-radius: 20px; padding: 14px; display: flex;
          flex-direction: row; align-items: center; gap: 16px; min-height: 72px; border: none;
          cursor: pointer; text-align: left; transition: transform 0.15s ease; box-sizing: border-box;
        }
        .card:focus-visible, .sos-btn:focus-visible, .banner-slide:focus-visible, .icon-btn:focus-visible { outline: 4px solid #7A4D00; outline-offset: 3px; }
        .card .icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: var(--white); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card .label { font-weight: 800; font-size: 17px; color: var(--ink); }
>>>>>>> 56b9dffd5330522d3546cc53c1af924451b5831e

        .sos-wrap { margin-top: auto; padding: 24px; }
        .sos-btn {
          width: 100%; min-height: 80px; background: var(--red); border: none; border-radius: 20px; padding: 16px 20px;
          display: flex; align-items: center; gap: 14px; box-shadow: 0 10px 22px rgba(179,63,51,0.4); cursor: pointer; box-sizing: border-box;
        }
        .sos-icon {
          width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sos-copy { text-align: left; }
        .sos-copy .t1 { font-size: 16px; font-weight: 900; color: #fff; }
        .sos-copy .t2 { font-size: 11.5px; font-weight: 700; color: #F6D9D4; margin-top: 1px; }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="header">
            {/* Top Row with Date, Language Pill and Exit Button */}
            <div className="top-row">
              <div className="orient">
                {currentDate}<span className="time">· {currentTime}</span>
              </div>
              <div className="icon-row">
                <button className="icon-btn" onClick={() => navigate('/patient/settings')} aria-label="Settings" title="Settings">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.1.14a1.7 1.7 0 0 1-2.9 0l-.1-.14a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.06.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.14-.1a1.7 1.7 0 0 1 0-2.9l.14-.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.06l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.1-.14a1.7 1.7 0 0 1 2.9 0l.1.14a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.06-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.25.6.4 1 .4h.08a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1 .4z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="greeting">
              {t(greeting)},<br /><span className="name">{userName}</span> 🌻
            </div>

            <button className={`voice-row ${isListening ? 'listening' : ''}`} onClick={startVoiceAssistant} aria-label={isListening ? 'Listening for your request' : 'Talk to Sahayak'}>
              <span className="mic-btn" aria-hidden="true">
                <div className="mic-ring"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z"/>
                  <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21"/>
                </svg>
              </span>
              <div className="voice-text">
                <div className="t1">{isListening ? t('home.listening') : t('home.tapAndSpeak')}</div>
                <div className="t2">{voiceFeedback}</div>
              </div>
            </button>
          </div>

          <button
            className="games-banner"
            onClick={() => navigate('/patient/games')}
            aria-label="Activity"
          >
<<<<<<< HEAD
            <div className="games-banner-icon">
              <img src="/patients_pp/patient3.jpg" alt="Activity" />
            </div>
            <div className="games-banner-copy">
              <div className="label">Activity</div>
              <div className="main">Activity</div>
            </div>
            <div className="games-banner-chevron">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6"/>
              </svg>
            </div>
          </button>

          <div className="priority-actions">
            <button className="priority-btn emergency" onClick={() => navigate('/patient/family')} aria-label="Family">
              <div className="priority-icon">
                <img src="/patients_pp/patient2.jpg" alt="Family" />
              </div>
              <div className="priority-copy"><div className="t1">Family</div><div className="t2">Connect with your loved ones</div></div>
            </button>

            <button className="priority-btn videos" onClick={() => navigate('/patient/videos-library')} aria-label="Videos">
              <div className="priority-icon">
                <img src="/patients_pp/patient1.jpg" alt="Videos" />
              </div>
              <div className="priority-copy"><div className="t1">Videos</div><div className="t2">Gentle learning and stories</div></div>
            </button>
          </div>

          <div className="see-all">
            <a onClick={() => setShowAllFeatures((prev) => !prev)}>{showAllFeatures ? 'Hide features' : 'See all features'}</a>
          </div>

          {showAllFeatures && (
            <div className="feature-list">
              <button className="feature-mini-card" onClick={() => navigate('/patient/reminders')}>
                <img src="/patients_pp/patient4.jpg" alt="Reminders" />
                <span>Reminders</span>
              </button>
              <button className="feature-mini-card" onClick={() => navigate('/patient/family')}>
                <img src="/patients_pp/patient6.jpeg" alt="Family" />
                <span>Family</span>
=======
            <div
              className="banner-track"
              style={{ transform: `translateX(${currentSlide === 0 ? '0%' : '-50%'})` }}
            >
              {/* SLIDE 1: Reminder */}
              <button
                className="banner-slide banner-reminder"
                onClick={() => navigate('/patient/reminders')}
              >
                <div className="banner-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v2M8 4.5a3 3 0 0 1 6 0v1.8c0 2.6 1 4 2 5.2H6c1-1.2 2-2.6 2-5.2Z"/>
                    <path d="M4.5 13.5h13M10 16.5a2 2 0 0 0 3 0"/>
                  </svg>
                </div>
                <div className="banner-copy">
                  <div className="label">{t('home.reminderSlide')}</div>
                  <div className="main">{t('home.takeMedicine')}</div>
                </div>
                <div className="banner-chevron" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6"/>
                  </svg>
                </div>
              </button>

              {/* SLIDE 2: Analytics */}
              <button
                className="banner-slide banner-analytics"
                onClick={() => navigate('/patient/analytics')}
              >
                <div className="banner-icon" aria-hidden="true">📊</div>
                <div className="banner-copy">
                  <div className="label">{t('home.playtimeAnalytics')}</div>
                  <div className="main">{t('home.activityInsights')}</div>
                </div>
                <div className="banner-chevron" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6"/>
                  </svg>
                </div>
>>>>>>> 56b9dffd5330522d3546cc53c1af924451b5831e
              </button>
            </div>
          )}

<<<<<<< HEAD
          <button className="help-floating" onClick={() => navigate('/patient/chat')} aria-label="Need help">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17h.01M9.09 9a3 3 0 1 1 5.82 1c-.93 1.37-2.59 1.92-2.59 3.5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
=======
          {/* Dots Indicator */}
          <div className="carousel-dots">
            <button className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)} aria-label="Show your next reminder" aria-pressed={currentSlide === 0} />
            <button className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)} aria-label="Show your activity summary" aria-pressed={currentSlide === 1} />
          </div>

          {/* Grid Menu */}
          <div className="grid">
            <button className="card" onClick={() => navigate('/patient/games')} aria-label="Games">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="7.5" width="19" height="10.5" rx="4"/>
                  <path d="M7 10.2v4.1M5 12.25h4M15.3 11.5h.01M17.8 13.6h.01"/>
                </svg>
              </div>
              <div className="label">{t('nav.games')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/reminders')} aria-label="Reminders">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M8 4.5a3 3 0 0 1 6 0v1.8c0 2.6 1 4 2 5.2H6c1-1.2 2-2.6 2-5.2Z"/>
                  <path d="M4.5 13.5h13M10 16.5a2 2 0 0 0 3 0"/>
                </svg>
              </div>
              <div className="label">{t('nav.reminders')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/yoga')} aria-label="Yoga">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1.8"/>
                  <path d="M12 9v4M12 13c-2.2 0-4 1-5.5 3.2M12 13c2.2 0 4 1 5.5 3.2M8 21l1.8-3.6M16 21l-1.8-3.6"/>
                </svg>
              </div>
              <div className="label">{t('nav.yoga')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/videos-library')} aria-label="Videos">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5" width="19" height="14" rx="3.5"/>
                  <path d="M10.5 9.3v5.4l4.5-2.7Z" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <div className="label">{t('nav.videos')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/family')} aria-label="Family">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8.5" cy="8" r="2.7"/><circle cx="16" cy="9" r="2.2"/>
                  <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5M14.3 19c0-2.2 1.5-3.8 3.4-3.8s3.3 1.6 3.3 3.8"/>
                </svg>
              </div>
              <div className="label">{t('nav.family')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/chat')} aria-label="Need Help">
              <div className="icon-wrap" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12a8 8 0 1 1 3.5 6.6L4 19.5l1-3.3A7.96 7.96 0 0 1 4 12Z"/>
                  <path d="M12 15v.01M12 13c0-1.8 2-1.6 2-3.3 0-1.1-.9-2-2-2s-2 .9-2 2"/>
                </svg>
              </div>
              <div className="label">{t('nav.needHelp')}</div>
            </button>
          </div>
>>>>>>> 56b9dffd5330522d3546cc53c1af924451b5831e

          {/* Emergency SOS Bar */}
          <div className="sos-wrap">
            <button
              className="sos-btn"
              onClick={() => navigate('/patient/emergency')}
              aria-label="Emergency SOS"
            >
              <div className="sos-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 1.9h2.6a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L7.6 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z"/>
                </svg>
              </div>
              <div className="sos-copy">
                <div className="t1">{t('emergency.callNow')}</div>
                <div className="t2">{t('home.familyLocationAlert')}</div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}