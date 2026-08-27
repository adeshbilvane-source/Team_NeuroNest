import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RemindersPage() {
  const navigate = useNavigate();
  const [waterInterval, setWaterInterval] = useState<number>(1.5);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    b: true,
    bed: true,
    bp: true,
    vit: false
  });

  const toggleSwitch = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rem-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --blue: #3E7FB8; --blue-tint: #E1EDF6;
        }
        .rem-root-container {
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
        .page-header {
          padding: 44px 18px 14px 18px; background: var(--white); box-shadow: var(--shadow);
          display: flex; align-items: center; gap: 12px; z-index: 2;
        }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }
        .section-label { margin: 20px 0 10px; font-size: 12px; font-weight: 900; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; }
        .section-label:first-child { margin-top: 0; }
        .water-card {
          background: linear-gradient(135deg, var(--blue) 0%, #2c5f8a 100%); border-radius: 20px;
          padding: 18px; color: #fff; box-shadow: 0 10px 22px rgba(62,127,184,0.35);
        }
        .water-card .t1 { font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #CFE2F2; }
        .water-card .t2 { font-size: 15px; font-weight: 800; margin-top: 2px; }
        .water-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 14px; }
        .step-btn {
          width: 42px; height: 42px; border-radius: 50%; border: none; background: rgba(255,255,255,0.22);
          color: #fff; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .water-val { font-size: 16px; font-weight: 800; min-width: 120px; text-align: center; }
        .card {
          background: var(--white); border-radius: 18px; padding: 14px 16px; margin-bottom: 10px;
          display: flex; align-items: center; gap: 14px; box-shadow: var(--shadow);
        }
        .card .icon-wrap {
          width: 44px; height: 44px; border-radius: 13px; background: var(--green-tint);
          display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        .card.med .icon-wrap { background: var(--marigold-tint); }
        .time { font-weight: 800; font-size: 14px; color: var(--green); min-width: 64px; }
        .cbody { flex: 1; }
        .cbody h4 { margin: 0 0 2px; font-size: 14.5px; color: var(--ink); }
        .cbody p { margin: 0; color: var(--ink-soft); font-size: 11.5px; font-weight: 700; }
        .toggle { width: 44px; height: 26px; border-radius: 20px; background: var(--green); position: relative; cursor: pointer; flex-shrink: 0; }
        .toggle::after { content: ''; width: 20px; height: 20px; background: #fff; border-radius: 50%; position: absolute; top: 3px; right: 3px; }
        .toggle.off { background: #D8D2C2; }
        .toggle.off::after { right: auto; left: 3px; }
        .pill { font-size: 10.5px; font-weight: 800; padding: 4px 9px; border-radius: 20px; background: var(--marigold-tint); color: #8a5a1c; white-space: nowrap; }
        .pill.scheduled { background: var(--green-tint); color: var(--green); }
        .add-btn {
          width: 100%; background: var(--white); border: 1.5px dashed #C7D3C9; color: var(--green);
          border-radius: 14px; padding: 12px; font-weight: 800; font-size: 13px; cursor: pointer; font-family: inherit; margin-top: 4px; margin-bottom: 6px;
        }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 11px 14px; font-size: 12px; color: #7a5015; font-weight: 700; line-height: 1.5; margin: 10px 0 4px;
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <h1>Reminders</h1>
          </div>

          <div className="content">
            <div className="section-label">Water reminder</div>
            <div className="water-card">
              <div className="t1">Background reminder</div>
              <div className="t2">A gentle nudge to drink water, all day</div>
              <div className="water-row">
                <button className="step-btn" onClick={() => setWaterInterval(p => Math.max(0.5, p - 0.5))}>−</button>
                <div className="water-val">Every {waterInterval} hours</div>
                <button className="step-btn" onClick={() => setWaterInterval(p => p + 0.5)}>+</button>
              </div>
            </div>
            <div className="callout">Not a separate section — just a reminder that pops up on its own. Use − and + to change how often.</div>

            <div className="section-label">Daily reminders</div>
            <div className="card">
              <div className="time">7:30<br />AM</div>
              <div className="cbody"><h4>Have breakfast</h4><p>Repeats every day</p></div>
              <div className={`toggle ${toggles.b ? '' : 'off'}`} onClick={() => toggleSwitch('b')}></div>
            </div>
            <div className="card">
              <div className="time">9:00<br />PM</div>
              <div className="cbody"><h4>Wind down for bed</h4><p>Repeats every day</p></div>
              <div className={`toggle ${toggles.bed ? '' : 'off'}`} onClick={() => toggleSwitch('bed')}></div>
            </div>
            <button className="add-btn" onClick={() => alert("Add reminder clicked")}>+ Add reminder</button>

            <div className="section-label">Medicine reminders</div>
            <div className="card med">
              <div className="icon-wrap">💊</div>
              <div className="time">8:00<br />AM</div>
              <div className="cbody"><h4>Blood pressure tablet</h4><p>1 tablet, after breakfast</p></div>
              <div className={`toggle ${toggles.bp ? '' : 'off'}`} onClick={() => toggleSwitch('bp')}></div>
            </div>
            <div className="card med">
              <div className="icon-wrap">💊</div>
              <div className="time">8:00<br />PM</div>
              <div className="cbody"><h4>Vitamin D</h4><p>1 tablet, with dinner</p></div>
              <div className={`toggle ${toggles.vit ? '' : 'off'}`} onClick={() => toggleSwitch('vit')}></div>
            </div>
            <button className="add-btn" onClick={() => alert("Add medicine clicked")}>+ Add medicine</button>
            <div className="callout">Medicine reminders wait for "Taken it". No response, and a family member gets a gentle nudge.</div>

            <div className="section-label">Appointments</div>
            <div className="card">
              <div className="time">Fri<br />10:30</div>
              <div className="cbody"><h4>Dr. Sharma — check-up</h4><p>City Clinic, Room 4</p></div>
              <span className="pill scheduled">Scheduled</span>
            </div>
            <div className="card">
              <div className="time">—</div>
              <div className="cbody"><h4>Eye specialist visit</h4><p>Date not decided yet</p></div>
              <span className="pill">To schedule</span>
            </div>
            <button className="add-btn" onClick={() => alert("Add appointment clicked")}>+ Add appointment</button>
            <div className="callout">"To schedule" items wait in a list. Once a family member picks a date, reminders start as it gets close.</div>
          </div>
        </div>
      </div>
    </div>
  );
}