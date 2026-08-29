import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSupportedLanguage } from '../../i18n';
import { getVoiceLocale } from '../../i18n/voiceLocale';

export default function PatientMicChat() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);

  const startVoiceAssistant = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getVoiceLocale(getSupportedLanguage(i18n.language));
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setIsListening(false);

      if (transcript.includes('game') || transcript.includes('play') || transcript.includes('yoga') || transcript.includes('exercise')) navigate('/patient/activities');
      else if (transcript.includes('analytics') || transcript.includes('graph')) navigate('/patient/analytics');
      else if (transcript.includes('reminder') || transcript.includes('medicine')) navigate('/patient/reminders');
      else if (transcript.includes('family') || transcript.includes('call')) navigate('/patient/family');
      else if (transcript.includes('video') || transcript.includes('music')) navigate('/patient/videos-library');
      else if (transcript.includes('help') || transcript.includes('chat')) navigate('/patient/chat');
      else if (transcript.includes('emergency') || transcript.includes('sos')) navigate('/patient/emergency');
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      <style>{`
        .global-voice-tray {
          position: absolute;
          right: 24px;
          bottom: 110px;
          z-index: 9999;
          display: flex; align-items: center; gap: 10px; pointer-events: auto;
          background: transparent; border-radius: 999px; padding: 0; box-shadow: none; border: none;
        }
        .voice-mic-btn {
          width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(180deg, #d73f34 0%, #b12d24 100%);
          display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px rgba(183, 49, 37, 0.38);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.2s ease;
          position: relative;
        }
        .voice-mic-btn::before,
        .voice-mic-btn::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid rgba(255, 94, 94, 0.35);
          opacity: 0;
        }
        .global-voice-tray.is-active .voice-mic-btn {
          background: linear-gradient(180deg, #f05b52 0%, #d93c31 100%);
          box-shadow: 0 0 0 8px rgba(255, 94, 94, 0.12), 0 12px 22px rgba(209, 67, 47, 0.42);
          animation: micListeningPulse 1.5s ease-in-out infinite;
        }
        .global-voice-tray.is-active .voice-mic-btn::before {
          opacity: 1;
          animation: micWave 1.8s ease-out infinite;
        }
        .global-voice-tray.is-active .voice-mic-btn::after {
          opacity: 1;
          animation: micWave 1.8s ease-out infinite 0.6s;
        }
        @keyframes micListeningPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes micWave {
          0% { transform: scale(0.9); opacity: 0.9; }
          80% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.42); opacity: 0; }
        }
        .voice-mic-btn:active { transform: scale(0.96); }
        .voice-mic-btn svg { width: 24px; height: 24px; stroke: #fff; position: relative; z-index: 1; }
        .voice-chat-btn {
          width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(180deg, #2e5a46 0%, #224b3d 100%);
          display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(24, 57, 48, 0.28);
          transition: transform 0.18s ease;
        }
        .voice-chat-btn:active { transform: scale(0.96); }
        .voice-chat-btn svg { width: 22px; height: 22px; stroke: #fff; }
      `}</style>

      <div className={`global-voice-tray ${isListening ? 'is-active' : ''}`} aria-label="Voice assistant controls">
        <button
          className="voice-mic-btn"
          type="button"
          onClick={startVoiceAssistant}
          aria-label={isListening ? 'Stop listening' : 'Start microphone'}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z"/>
            <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21"/>
          </svg>
        </button>

        <button
          className="voice-chat-btn"
          type="button"
          onClick={() => navigate('/patient/chat')}
          aria-label="Open chat"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 18.5V7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H9l-4 2.5Z"/>
            <path d="M8.5 9h7M8.5 12h5"/>
          </svg>
        </button>
      </div>
    </>
  );
}
