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

  // Carousel Slide State (0 = Reminder, 1 = Analytics)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  // Touch Swipe Handlers for Banner Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 40) {
      setCurrentSlide(1);
    } else if (diff < -40) {
      setCurrentSlide(0);
    }
    setTouchStart(null);
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
          --green: #3F6B4F; --green-tint: #E3EDE5; --marigold: #D98A2B;
          --red: #B33F33; --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --blue: #3E7FB8; --blue-dark: #2C5F8A;
        }
        .home-root-container {
          display: flex; align-items: center; justify-content: center; min-height: 100vh;
          width: 100%; background: #DCE3D6; padding: 16px; box-sizing: border-box; font-family: 'Nunito', sans-serif;
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
        .header { padding: 44px 20px 10px 20px; }
        .top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .orient { font-weight: 800; color: var(--ink-soft); font-size: 13.5px; letter-spacing: 0.2px; }
        .orient .time { color: var(--green); font-size: 13.5px; margin-left: 4px; }
        
        .icon-row { display: flex; align-items: center; gap: 8px; }
        .lang-pill {
          height: 36px; padding: 0 12px; border-radius: 12px; background: var(--white);
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 5px;
          font-weight: 800; font-size: 12.5px; color: var(--green); cursor: pointer; border: none;
        }
        .icon-btn {
          width: 36px; height: 36px; border-radius: 12px; background: var(--white);
          display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow); border: none; cursor: pointer; flex-shrink: 0;
        }

        .greeting { font-family: 'Fraunces', serif; font-weight: 600; font-style: italic; color: var(--ink); font-size: 28px; line-height: 1.15; margin: 14px 0 0 0; }
        .greeting .name { color: var(--green); font-style: normal; }
        .voice-row {
          display: flex; align-items: center; gap: 14px; margin-top: 14px; background: var(--white);
          border-radius: 20px; padding: 12px 16px; box-shadow: var(--shadow); cursor: pointer;
        }
        .mic-btn {
          width: 52px; height: 52px; min-width: 52px; border-radius: 50%; background: var(--marigold);
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

        .banner-carousel-wrapper {
          margin: 12px 20px 0 20px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }
        .banner-track {
          display: flex;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          width: 200%;
        }
        .banner-slide {
          width: 50%;
          border-radius: 20px;
          padding: 16px 18px;
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
          display: flex; justify-content: center; gap: 6px; margin-top: 8px; margin-bottom: 2px;
        }
        .dot {
          width: 7px; height: 7px; border-radius: 50%; background: #C7D3C9; transition: all 0.2s ease; cursor: pointer;
        }
        .dot.active { width: 18px; border-radius: 10px; background: var(--green); }

        .grid { margin: 12px 20px 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card {
          background: var(--green-tint); border-radius: 20px; padding: 14px; display: flex;
          flex-direction: column; align-items: flex-start; gap: 18px; min-height: 106px; border: none;
          cursor: pointer; text-align: left; transition: transform 0.15s ease; box-sizing: border-box;
        }
        .card:active { transform: scale(0.97); }
        .card .icon-wrap { width: 44px; height: 44px; border-radius: 13px; background: var(--white); display: flex; align-items: center; justify-content: center; }
        .card .label { font-weight: 800; font-size: 15px; color: var(--ink); }

        .sos-wrap { margin-top: auto; padding: 14px 20px 24px 20px; }
        .sos-btn {
          width: 100%; background: var(--red); border: none; border-radius: 20px; padding: 14px 18px;
          display: flex; align-items: center; gap: 14px; box-shadow: 0 10px 22px rgba(179,63,51,0.4); cursor: pointer; box-sizing: border-box;
        }
        .sos-icon {
          width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.2);
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
                <button className="icon-btn" onClick={handleLogout} aria-label="Logout" title="Logout">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="greeting">
              {t(greeting)},<br /><span className="name">{userName}</span> 🌻
            </div>

            <div className={`voice-row ${isListening ? 'listening' : ''}`} onClick={startVoiceAssistant}>
              <button className="mic-btn" aria-label="Talk to assistant">
                <div className="mic-ring"></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z"/>
                  <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21"/>
                </svg>
              </button>
              <div className="voice-text">
                <div className="t1">{isListening ? t('home.listening') : t('home.tapAndSpeak')}</div>
                <div className="t2">{voiceFeedback}</div>
              </div>
            </div>
          </div>

          {/* SWIPEABLE DUAL BANNER (Reminder <-> Analytics) */}
          <div
            className="banner-carousel-wrapper"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="banner-track"
              style={{ transform: `translateX(${currentSlide === 0 ? '0%' : '-50%'})` }}
            >
              {/* SLIDE 1: Reminder */}
              <button
                className="banner-slide banner-reminder"
                onClick={() => navigate('/patient/reminders')}
              >
                <div className="banner-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v2M8 4.5a3 3 0 0 1 6 0v1.8c0 2.6 1 4 2 5.2H6c1-1.2 2-2.6 2-5.2Z"/>
                    <path d="M4.5 13.5h13M10 16.5a2 2 0 0 0 3 0"/>
                  </svg>
                </div>
                <div className="banner-copy">
                  <div className="label">{t('home.reminderSlide')}</div>
                  <div className="main">{t('home.takeMedicine')}</div>
                </div>
                <div className="banner-chevron">
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
                <div className="banner-icon">📊</div>
                <div className="banner-copy">
                  <div className="label">{t('home.playtimeAnalytics')} ‹ Slide ›</div>
                  <div className="main">{t('home.activityInsights')}</div>
                </div>
                <div className="banner-chevron">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            <div className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)} />
            <div className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)} />
          </div>

          {/* Grid Menu */}
          <div className="grid">
            <button className="card" onClick={() => navigate('/patient/games')} aria-label="Games">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="7.5" width="19" height="10.5" rx="4"/>
                  <path d="M7 10.2v4.1M5 12.25h4M15.3 11.5h.01M17.8 13.6h.01"/>
                </svg>
              </div>
              <div className="label">{t('nav.games')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/reminders')} aria-label="Reminders">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2M8 4.5a3 3 0 0 1 6 0v1.8c0 2.6 1 4 2 5.2H6c1-1.2 2-2.6 2-5.2Z"/>
                  <path d="M4.5 13.5h13M10 16.5a2 2 0 0 0 3 0"/>
                </svg>
              </div>
              <div className="label">{t('nav.reminders')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/yoga')} aria-label="Yoga">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1.8"/>
                  <path d="M12 9v4M12 13c-2.2 0-4 1-5.5 3.2M12 13c2.2 0 4 1 5.5 3.2M8 21l1.8-3.6M16 21l-1.8-3.6"/>
                </svg>
              </div>
              <div className="label">{t('nav.yoga')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/videos-library')} aria-label="Videos">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5" width="19" height="14" rx="3.5"/>
                  <path d="M10.5 9.3v5.4l4.5-2.7Z" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <div className="label">{t('nav.videos')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/family')} aria-label="Family">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8.5" cy="8" r="2.7"/><circle cx="16" cy="9" r="2.2"/>
                  <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5M14.3 19c0-2.2 1.5-3.8 3.4-3.8s3.3 1.6 3.3 3.8"/>
                </svg>
              </div>
              <div className="label">{t('nav.family')}</div>
            </button>

            <button className="card" onClick={() => navigate('/patient/chat')} aria-label="Need Help">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12a8 8 0 1 1 3.5 6.6L4 19.5l1-3.3A7.96 7.96 0 0 1 4 12Z"/>
                  <path d="M12 15v.01M12 13c0-1.8 2-1.6 2-3.3 0-1.1-.9-2-2-2s-2 .9-2 2"/>
                </svg>
              </div>
              <div className="label">{t('nav.needHelp')}</div>
            </button>
          </div>

          {/* Emergency SOS Bar */}
          <div className="sos-wrap">
            <button
              className="sos-btn"
              onClick={() => navigate('/patient/emergency')}
              aria-label="Emergency SOS"
            >
              <div className="sos-icon">
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