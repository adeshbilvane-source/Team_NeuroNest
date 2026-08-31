import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSupportedLanguage } from '../../i18n';
import { getVoiceLocale } from '../../i18n/voiceLocale';
import { setVoiceStatus, subscribeVoiceStatus } from '../../services/VoiceService';

type VoiceStatus = { phase: 'speaking' | 'pause' | 'listening' | 'idle'; text: string };

// Variables to fix immediate disappearing bug
let currentUtterance: SpeechSynthesisUtterance | null = null;
let textClearTimeout: number | undefined;

// --- AI VOICE FUNCTION ---
const speakText = (text: string, setAssistantStatus: (msg: string) => void) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); 
  
  if (textClearTimeout) clearTimeout(textClearTimeout);
  
  setAssistantStatus(text); 

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'en-US'; 
  currentUtterance.rate = 0.85; 
  currentUtterance.pitch = 1.0;

  currentUtterance.onend = () => {
    textClearTimeout = window.setTimeout(() => {
      setAssistantStatus('');
    }, 3000); 
  };

  currentUtterance.onerror = () => {
    textClearTimeout = window.setTimeout(() => {
      setAssistantStatus('');
    }, 3000);
  };

  window.speechSynthesis.speak(currentUtterance);
};

// --- SMART QUESTION & OPTIONS READER ---
const readQuestionAndOptions = (setAssistantStatus: (msg: string) => void) => {
  let questionText = "";

  const allTextElements = document.querySelectorAll('h1, h2, h3, h4, p, span, div');
  for (let i = 0; i < allTextElements.length; i++) {
    const el = allTextElements[i] as HTMLElement;
    if (el.children.length === 0 || el.tagName.toLowerCase() === 'p' || el.tagName.match(/^h[1-6]$/)) {
      const text = el.innerText?.trim();
      if (text && text.includes('?')) {
        questionText = text; 
        break;
      }
    }
  }

  if (!questionText) {
    const fallbackNodes = document.querySelectorAll('h1, h2, h3, h4, p');
    for (let i = 0; i < fallbackNodes.length; i++) {
      const text = (fallbackNodes[i] as HTMLElement).innerText?.trim();
      if (text && text.length > 5 && !text.toLowerCase().includes('level')) {
        questionText = text;
        break;
      }
    }
  }

  const optionElements = document.querySelectorAll('button:not(.voice-mic-btn)');
  const validOptions: string[] = [];
  
  optionElements.forEach((btn) => {
    const text = (btn as HTMLElement).innerText.trim();
    if (text.length > 1 && text.toLowerCase() !== 'en' && !text.toLowerCase().includes('playing random')) {
      validOptions.push(text);
    }
  });

  if (!questionText && validOptions.length === 0) {
    speakText("There is nothing specific to read on this screen.", setAssistantStatus);
    return;
  }

  let speechText = "";
  if (questionText) {
    speechText += "The question is: " + questionText + ". ";
  }
  
  if (validOptions.length > 0) {
    speechText += "Your options are: ";
    validOptions.forEach((opt, index) => {
      let cleanOpt = opt.replace(/\(lvl\s*\d+\)/gi, '').trim();
      speechText += "Option " + (index + 1) + ". " + cleanOpt + ". ";
    });
  }

  speakText(speechText, setAssistantStatus);
};

// --- SMART AUTO-CLICKER ---
const attemptClickOnScreen = (transcript: string, setAssistantStatus: (msg: string) => void): boolean => {
  const buttons = Array.from(document.querySelectorAll('button:not(.voice-mic-btn)'));
  
  for (const btn of buttons) {
    const btnText = (btn as HTMLElement).innerText.toLowerCase().trim();
    if (!btnText || btnText.length < 2 || btnText === 'en') continue;

    const cleanText = btnText.replace(/\(lvl\s*\d+\)/gi, '').trim();
    
    let matched = false;
    if (transcript.includes(cleanText)) {
      matched = true;
    } else {
      const words = cleanText.split(/[\s&]+/);
      for (const w of words) {
        if (w.length >= 4 && transcript.includes(w)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      (btn as HTMLElement).click();
      speakText("Selecting " + cleanText, setAssistantStatus);
      return true;
    }
  }
  return false; 
};

export default function PatientMicChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState(''); 

  // Mic ko continuously run karne ke liye naye refs
  const keepListening = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return subscribeVoiceStatus((status: VoiceStatus) => {
      setIsListening(status.phase === 'listening');
    });
  }, []);

  // Component unmount hone par mic band karne ke liye
  useEffect(() => {
    return () => {
      keepListening.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!location.pathname.startsWith('/patient')) {
    return null; 
  }

  const toggleVoiceAssistant = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    // Agar mic pehle se chal raha hai, toh usko rok do
    if (isListening) {
      keepListening.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
      setAssistantMessage('');
      setVoiceStatus({ phase: 'idle', text: '' });
      return;
    }

    // Mic start karne ka process
    keepListening.current = true;
    if (textClearTimeout) clearTimeout(textClearTimeout);

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    let listeningTimer: number | undefined;

    recognition.onstart = () => {
      window.speechSynthesis.cancel(); 
      setIsListening(true);
      setAssistantMessage('Listening...'); 
      setVoiceStatus({ phase: 'listening', text: 'Listening...' });
      listeningTimer = window.setTimeout(() => recognition.stop(), 30000);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? '')
        .join(' ')
        .toLowerCase();

      if (listeningTimer) window.clearTimeout(listeningTimer);
      
      if (!transcript) {
        setAssistantMessage('');
        return; // Auto-loop handled by onend
      }

      // 0. READ COMMANDS
      if (transcript.includes('read question') || transcript.includes('read option') || transcript.includes('what is the question')) {
        readQuestionAndOptions(setAssistantMessage);
        return;
      }
      else if (transcript.includes('read') || transcript.includes('padh') || transcript.includes('sunao')) {
        readQuestionAndOptions(setAssistantMessage); 
        return; 
      }

      // 1. AUTO-CLICKER
      if (attemptClickOnScreen(transcript, setAssistantMessage)) {
        return;
      }

      // 2. NAVIGATIONS
      if (transcript.includes('memory') || transcript.includes('match cards') || transcript.includes('card game')) {
        navigate('/patient/games/memory-match');
        speakText("Opening memory match game.", setAssistantMessage);
      } 
      else if (transcript.includes('identify picture') || transcript.includes('picture game') || transcript.includes('what is shown')) {
        navigate('/patient/games/identify-picture');
        speakText("Opening identify picture game.", setAssistantMessage);
      } 
      else if (transcript.includes('jigsaw') || transcript.includes('puzzle')) {
        navigate('/patient/games/jigsaw');
        speakText("Opening jigsaw puzzle.", setAssistantMessage);
      } 
      else if (transcript.includes('sort') || transcript.includes('button sorting')) {
        navigate('/patient/games/button-sorting');
        speakText("Opening button sorting game.", setAssistantMessage);
      } 
      else if (transcript.includes('video') || transcript.includes('videos') || transcript.includes('library') || transcript.includes('watch')) {
        navigate('/patient/videos-library');
        speakText("Opening video library.", setAssistantMessage);
      } 
      else if (transcript.includes('yoga') || transcript.includes('exercise') || transcript.includes('meditation')) {
        navigate('/patient/yoga');
        speakText("Opening yoga and exercise.", setAssistantMessage);
      }
      else if (transcript.includes('reminder') || transcript.includes('medic') || transcript.includes('medicine') || transcript.includes('routine')) {
        navigate('/patient/reminders');
        speakText("Opening your daily reminders.", setAssistantMessage);
      } 
      else if (transcript.includes('activit')) {
        navigate('/patient/activities');
        speakText("Opening activities page.", setAssistantMessage);
      } 
      else if (transcript.includes('game') || transcript.includes('games') || transcript.includes('play')) {
        navigate('/patient/games');
        speakText("Opening games hub.", setAssistantMessage);
      } 
      else if (transcript.includes('family') || transcript.includes('relative') || transcript.includes('caregiver')) {
        navigate('/patient/family');
        speakText("Opening family emergency page.", setAssistantMessage);
      } 
      else if (transcript.includes('analytics') || transcript.includes('report') || transcript.includes('stats') || transcript.includes('graph')) {
        navigate('/patient/analytics');
        speakText("Opening analytics report.", setAssistantMessage);
      } 
      else if (transcript.includes('appointment') || transcript.includes('calendar')) {
        navigate('/patient/appointments');
        speakText("Opening your appointments.", setAssistantMessage);
      } 
      else if (transcript.includes('chat') || transcript.includes('message') || transcript.includes('support')) {
        navigate('/patient/chat');
        speakText("Opening chat support.", setAssistantMessage);
      } 
      else if (transcript.includes('settings') || transcript.includes('preferences')) {
        navigate('/patient/settings');
        speakText("Opening settings.", setAssistantMessage);
      } 
      else if (transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('help me') || transcript.includes('help')) {
        navigate('/patient/emergency');
        speakText("Emergency page opened. Help is available.", setAssistantMessage);
      } 
      else if (transcript.includes('home') || transcript.includes('main') || transcript.includes('dashboard')) {
        navigate('/patient');
        speakText("Going back to the home page.", setAssistantMessage);
      } else {
        speakText("I didn't quite catch that. Please try again.", setAssistantMessage);
      }
    };

    recognition.onerror = (event: any) => {
      if (listeningTimer) window.clearTimeout(listeningTimer);
      // Agar browser mic block karde toh loop tod do
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        keepListening.current = false;
        setIsListening(false);
        setAssistantMessage('');
        setVoiceStatus({ phase: 'idle', text: '' });
      }
    };

    // Auto-loop logic
    recognition.onend = () => {
      if (listeningTimer) window.clearTimeout(listeningTimer);
      
      if (keepListening.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
          setVoiceStatus({ phase: 'idle', text: '' });
        }
      } else {
        setIsListening(false);
        setVoiceStatus({ phase: 'idle', text: '' });
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch {
      keepListening.current = false;
      setIsListening(false);
      setAssistantMessage('');
      setVoiceStatus({ phase: 'idle', text: '' });
    }
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
          gap: 12px;
          pointer-events: auto;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          border-radius: 0;
        }
        .voice-status-pill {
          background: rgba(255, 255, 255, 0.45); 
          backdrop-filter: blur(12px); 
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          color: #1a241e;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 240px;
          text-align: right;
          animation: fadeInOut 0.3s ease-in-out;
          white-space: normal; 
          word-wrap: break-word;
        }
        @keyframes fadeInOut {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
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
        {assistantMessage && (
          <div className="voice-status-pill">
            {assistantMessage}
          </div>
        )}

        <button
          className="voice-mic-btn"
          type="button"
          onClick={toggleVoiceAssistant}
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