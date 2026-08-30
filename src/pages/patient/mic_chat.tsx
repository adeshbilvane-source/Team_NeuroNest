import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSupportedLanguage } from '../../i18n';
import { getVoiceLocale } from '../../i18n/voiceLocale';
import { setVoiceStatus, subscribeVoiceStatus } from '../../services/VoiceService';

type VoiceStatus = { phase: 'speaking' | 'pause' | 'listening' | 'idle'; text: string };

// --- AI VOICE FUNCTION ---
const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); 
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; 
  utterance.rate = 0.85; 
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

// --- SMART QUESTION & OPTIONS READER ---
const readQuestionAndOptions = () => {
  let questionText = "";

  // 1. Sawal Dhundna (Question Scanner): Screen par wo text dhundega jisme '?' ho
  const allTextElements = document.querySelectorAll('h1, h2, h3, h4, p, span, div');
  for (let i = 0; i < allTextElements.length; i++) {
    const el = allTextElements[i] as HTMLElement;
    // Agar element ke andar direct text hai (bahut saare child tags nahi hain)
    if (el.children.length === 0 || el.tagName.toLowerCase() === 'p' || el.tagName.match(/^h[1-6]$/)) {
      const text = el.innerText?.trim();
      if (text && text.includes('?')) {
        questionText = text; // Question mil gaya!
        break;
      }
    }
  }

  // Agar '?' nahi mila, toh pehli heading ya paragraph uthayega (Level wale text ko chhod kar)
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

  // 2. Options dhundna: Bekar buttons (<, ?, EN) aur Level buttons ko hata dega
  const optionElements = document.querySelectorAll('button:not(.voice-mic-btn)');
  const validOptions: string[] = [];
  
  optionElements.forEach((btn) => {
    const text = (btn as HTMLElement).innerText.trim();
    // Chote words aur upar wale filter/level buttons ko ignore karega (jinke naam bahut lambe ya irrelevant hain)
    if (text.length > 1 && text.toLowerCase() !== 'en' && !text.toLowerCase().includes('playing random')) {
      validOptions.push(text);
    }
  });

  if (!questionText && validOptions.length === 0) {
    speakText("There is nothing specific to read on this screen.");
    return;
  }

  // 3. AI Script Taiyar Karna
  let speechText = "";
  if (questionText) {
    speechText += "The question is: " + questionText + ". ";
  }
  
  if (validOptions.length > 0) {
    speechText += "Your options are: ";
    validOptions.forEach((opt, index) => {
      // Clean up text ("Shapes (Lvl 1)" -> "Shapes")
      let cleanOpt = opt.replace(/\(lvl\s*\d+\)/gi, '').trim();
      speechText += "Option " + (index + 1) + ". " + cleanOpt + ". ";
    });
  }

  speakText(speechText);
};

// --- SMART AUTO-CLICKER ---
const attemptClickOnScreen = (transcript: string): boolean => {
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
      speakText("Selecting " + cleanText);
      return true;
    }
  }
  return false; 
};


export default function PatientMicChat() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    return subscribeVoiceStatus((status: VoiceStatus) => {
      setIsListening(status.phase === 'listening');
    });
  }, []);

  useEffect(() => {
    window.speechSynthesis.cancel();
  }, [navigate]);

  const startVoiceAssistant = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    let listeningTimer: number | undefined;

    recognition.onstart = () => {
      window.speechSynthesis.cancel(); 
      setIsListening(true);
      setVoiceStatus({ phase: 'listening', text: 'Listening...' });
      listeningTimer = window.setTimeout(() => recognition.stop(), 30000);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? '')
        .join(' ')
        .toLowerCase();

      setIsListening(false);
      if (listeningTimer) window.clearTimeout(listeningTimer);
      setVoiceStatus({ phase: 'idle', text: '' });

      if (!transcript) return;

      // 0. READ COMMANDS
      if (transcript.includes('read question') || transcript.includes('read option') || transcript.includes('what is the question')) {
        readQuestionAndOptions();
        return;
      }
      else if (transcript.includes('read') || transcript.includes('padh') || transcript.includes('sunao')) {
        readQuestionAndOptions(); 
        return; 
      }

      // 1. AUTO-CLICKER
      if (attemptClickOnScreen(transcript)) {
        return;
      }

      // 2. SPECIFIC GAMES
      if (transcript.includes('memory') || transcript.includes('match cards') || transcript.includes('card game')) {
        navigate('/patient/games/memory-match');
        speakText("Opening memory match game.");
      } 
      else if (transcript.includes('identify picture') || transcript.includes('picture game') || transcript.includes('what is shown')) {
        navigate('/patient/games/identify-picture');
        speakText("Opening identify picture game.");
      } 
      else if (transcript.includes('jigsaw') || transcript.includes('puzzle')) {
        navigate('/patient/games/jigsaw');
        speakText("Opening jigsaw puzzle.");
      } 
      else if (transcript.includes('sort') || transcript.includes('button sorting')) {
        navigate('/patient/games/button-sorting');
        speakText("Opening button sorting game.");
      } 
      
      // 3. SPECIFIC MEDIA & YOGA
      else if (transcript.includes('video') || transcript.includes('videos') || transcript.includes('library') || transcript.includes('watch')) {
        navigate('/patient/videos-library');
        speakText("Opening video library.");
      } 
      else if (transcript.includes('yoga') || transcript.includes('exercise') || transcript.includes('meditation')) {
        navigate('/patient/yoga');
        speakText("Opening yoga and exercise.");
      }
      else if (transcript.includes('reminder') || transcript.includes('medic') || transcript.includes('medicine') || transcript.includes('routine')) {
        navigate('/patient/reminders');
        speakText("Opening your daily reminders.");
      } 
      
      // 4. GENERAL CATEGORIES
      else if (transcript.includes('activit')) {
        navigate('/patient/activities');
        speakText("Opening activities page.");
      } 
      else if (transcript.includes('game') || transcript.includes('games') || transcript.includes('play')) {
        navigate('/patient/games');
        speakText("Opening games hub.");
      } 
      
      // 5. BAAKI PAGES
      else if (transcript.includes('family') || transcript.includes('relative') || transcript.includes('caregiver')) {
        navigate('/patient/family');
        speakText("Opening family emergency page.");
      } 
      else if (transcript.includes('analytics') || transcript.includes('report') || transcript.includes('stats') || transcript.includes('graph')) {
        navigate('/patient/analytics');
      } 
      else if (transcript.includes('appointment') || transcript.includes('calendar')) {
        navigate('/patient/appointments');
        speakText("Opening your appointments.");
      } 
      else if (transcript.includes('chat') || transcript.includes('message') || transcript.includes('support')) {
        navigate('/patient/chat');
        speakText("Opening chat support.");
      } 
      else if (transcript.includes('settings') || transcript.includes('preferences')) {
        navigate('/patient/settings');
      } 
      else if (transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('help me') || transcript.includes('help')) {
        navigate('/patient/emergency');
        speakText("Emergency page opened. Don't panic, help is available.");
      } 
      else if (transcript.includes('home') || transcript.includes('main') || transcript.includes('dashboard')) {
        navigate('/patient');
        speakText("Going back to the home page.");
      }
    };

    recognition.onerror = () => {
      if (listeningTimer) window.clearTimeout(listeningTimer);
      setIsListening(false);
      setVoiceStatus({ phase: 'idle', text: '' });
    };
    recognition.onend = () => {
      if (listeningTimer) window.clearTimeout(listeningTimer);
      setIsListening(false);
      setVoiceStatus({ phase: 'idle', text: '' });
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
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