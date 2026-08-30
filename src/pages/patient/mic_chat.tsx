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

    if (isListening) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getVoiceLocale(getSupportedLanguage(i18n.language));
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? '')
        .join(' ')
        .toLowerCase();

      setIsListening(false);

      if (!transcript) {
        return;
      }

      if (transcript.includes('home') || transcript.includes('main') || transcript.includes('dashboard')) {
        navigate('/patient');
      } else if (transcript.includes('activity') || transcript.includes('activities') || transcript.includes('game') || transcript.includes('games') || transcript.includes('play') || transcript.includes('yoga') || transcript.includes('exercise')) {
        navigate('/patient/activities');
      } else if (transcript.includes('identify picture') || transcript.includes('picture game') || transcript.includes('what is shown')) {
        navigate('/patient/games/identify-picture');
      } else if (transcript.includes('memory') || transcript.includes('match cards') || transcript.includes('card game')) {
        navigate('/patient/games/memory-match');
      } else if (transcript.includes('jigsaw') || transcript.includes('puzzle')) {
        navigate('/patient/games/jigsaw');
      } else if (transcript.includes('sort') || transcript.includes('button sorting')) {
        navigate('/patient/games/button-sorting');
      } else if (transcript.includes('video') || transcript.includes('videos') || transcript.includes('library') || transcript.includes('watch')) {
        navigate('/patient/videos-library');
      } else if (transcript.includes('reminder') || transcript.includes('medic') || transcript.includes('medicine') || transcript.includes('routine')) {
        navigate('/patient/reminders');
      } else if (transcript.includes('family') || transcript.includes('relative') || transcript.includes('caregiver')) {
        navigate('/patient/family');
      } else if (transcript.includes('analytics') || transcript.includes('report') || transcript.includes('stats') || transcript.includes('graph')) {
        navigate('/patient/analytics');
      } else if (transcript.includes('appointment') || transcript.includes('calendar')) {
        navigate('/patient/appointments');
      } else if (transcript.includes('chat') || transcript.includes('message') || transcript.includes('support')) {
        navigate('/patient/chat');
      } else if (transcript.includes('settings') || transcript.includes('preferences')) {
        navigate('/patient/settings');
      } else if (transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('help me') || transcript.includes('help')) {
        navigate('/patient/emergency');
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <>
      <style>{`
        .patient-global-mic-layer {
          position: fixed;
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          width: min(410px, calc(100vw - 22px));
          height: calc(100vh - 20px);
          pointer-events: none;
          z-index: 999;
        }
        .patient-global-mic-layer .global-voice-tray {
          pointer-events: auto;
        }
        .global-voice-tray {
          position: absolute;
          right: 24px;
          bottom: 24px;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          border-radius: 0;
        }
        .voice-mic-btn {
          width: 60px;
          min-width: 60px;
          height: 60px;
          min-height: 60px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 10px 20px rgba(36, 50, 42, 0.12);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          background: linear-gradient(180deg, #dfeee0 0%, #cfe1d0 100%);
        }
        .voice-mic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 22px rgba(36, 50, 42, 0.14);
        }
        .voice-mic-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .global-voice-tray.is-active .voice-mic-btn {
          background: linear-gradient(180deg, #eaf4eb 0%, #d8ebdc 100%);
          box-shadow: 0 0 0 8px rgba(63, 107, 79, 0.06), 0 12px 24px rgba(63, 107, 79, 0.12);
          animation: micListeningPulse 1.4s ease-in-out infinite;
        }
        @keyframes micListeningPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .voice-mic-btn svg {
          width: 24px;
          height: 24px;
          stroke: #24322A;
          position: relative;
          z-index: 1;
        }
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
      </div>
    </>
  );
}
