import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  mine: boolean;
  time: string;
}

export default function PatientChatThreadPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Good morning! How are you feeling today?", mine: false, time: "9:02 AM" },
    { text: "A little tired, but I did my memory game already.", mine: true, time: "9:05 AM" },
    { text: "That's wonderful. I saw your scores — keep it up! Don't forget your 2 PM medicine.", mine: false, time: "9:06 AM" },
    { text: "Okay doctor, I will. Thank you.", mine: true, time: "9:07 AM" }
  ]);
  const [inputText, setInputText] = useState<string>("");

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    setMessages((prev) => [...prev, { text: text.trim(), mine: true, time: timeStr }]);
    setInputText("");
  };

  return (
    <div className="chat-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA; --white: #FFFFFF;
          --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .chat-root-container {
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
        .chat-header {
          padding: 44px 18px 14px 18px; background: var(--white); box-shadow: var(--shadow);
          display: flex; align-items: center; gap: 12px; z-index: 2;
        }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .avatar {
          width: 44px; height: 44px; border-radius: 50%; background: var(--green);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .who .name { font-size: 15.5px; font-weight: 800; color: var(--ink); }
        .who .status { font-size: 11.5px; font-weight: 700; color: var(--green); margin-top: 1px; }
        .who .status::before { content: "\\25CF"; font-size: 8px; margin-right: 5px; }
        .call-btn {
          margin-left: auto; width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .thread { flex: 1; padding: 18px 16px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .day-sep { text-align: center; font-size: 11px; font-weight: 800; color: var(--ink-soft); margin: 4px 0 6px 0; }
        .bubble-row { display: flex; }
        .bubble-row.mine { justify-content: flex-end; }
        .bubble {
          max-width: 76%; padding: 11px 14px; border-radius: 18px; font-size: 14px;
          font-weight: 700; line-height: 1.4;
        }
        .bubble-row:not(.mine) .bubble {
          background: var(--white); color: var(--ink); border-bottom-left-radius: 5px; box-shadow: var(--shadow);
        }
        .bubble-row.mine .bubble { background: var(--green); color: #fff; border-bottom-right-radius: 5px; }
        .time { font-size: 10px; font-weight: 700; color: var(--ink-soft); margin-top: 4px; }
        .time-wrap { display: flex; justify-content: flex-start; margin-top: -6px; }
        .time-wrap.mine { justify-content: flex-end; }
        .quick-row { padding: 0 16px 8px 16px; display: flex; gap: 8px; overflow-x: auto; }
        .quick-chip {
          flex-shrink: 0; background: var(--white); border: 1.5px solid var(--green-tint);
          color: var(--green); font-weight: 800; font-size: 12.5px; padding: 8px 14px; border-radius: 20px;
          cursor: pointer; white-space: nowrap;
        }
        .input-bar {
          padding: 10px 14px 22px 14px; background: var(--white); display: flex;
          align-items: center; gap: 8px; box-shadow: 0 -6px 16px rgba(36,50,42,0.06);
        }
        .text-input {
          flex: 1; background: var(--canvas); border-radius: 22px; padding: 12px 16px;
          font-size: 14px; font-weight: 700; color: var(--ink); border: none; outline: none; font-family: inherit;
        }
        .round-btn {
          width: 44px; height: 44px; min-width: 44px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .round-btn.mic { background: var(--marigold-tint); }
        .round-btn.send { background: var(--green); }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="chat-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <div className="avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c0-3.6 3-6 7.5-6s7.5 2.4 7.5 6"/></svg>
            </div>
            <div className="who">
              <div className="name">Caregiver / Doctor</div>
              <div className="status">Online</div>
            </div>
            <button className="call-btn" onClick={() => alert("Initiating Voice Call...")} aria-label="Call">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 1.9h2.6a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L7.6 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z"/></svg>
            </button>
          </div>

          <div className="thread">
            <div className="day-sep">Today</div>
            {messages.map((m, idx) => (
              <div key={idx}>
                <div className={`bubble-row ${m.mine ? 'mine' : ''}`}>
                  <div className="bubble">{m.text}</div>
                </div>
                <div className={`time-wrap ${m.mine ? 'mine' : ''}`}>
                  <div className="time">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-row">
            <button className="quick-chip" onClick={() => handleSendMessage("I'm feeling fine")}>I'm feeling fine</button>
            <button className="quick-chip" onClick={() => handleSendMessage("I need an appointment")}>I need an appointment</button>
            <button className="quick-chip" onClick={() => handleSendMessage("I forgot my medicine")}>I forgot my medicine</button>
          </div>

          <div className="input-bar">
            <input
              type="text"
              className="text-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="round-btn mic" onClick={() => alert("Voice transcription started...")} aria-label="Speak message">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--marigold)" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v5.5A3.5 3.5 0 0 0 12 15Z"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 18.5V21"/></svg>
            </button>
            <button className="round-btn send" onClick={() => handleSendMessage()} aria-label="Send message">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l16-8-6 16-3-6-7-2Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}