import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FamilyEmergencyPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'family' | 'emergency'>('family');
  const [modalType, setModalType] = useState<'options' | 'caregiver' | null>(null);

  return (
    <div className="fam-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --red-tint: #F4DEDA;
        }
        .fam-root-container {
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
        .page-header { padding: 44px 18px 0 18px; background: var(--white); box-shadow: var(--shadow); z-index: 2; }
        .header-top { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .tabbar { display: flex; gap: 8px; padding-bottom: 14px; }
        .tab {
          padding: 10px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; cursor: pointer;
          background: var(--green-tint); color: var(--green); border: none; font-family: inherit;
        }
        .tab.active { background: var(--green); color: #fff; }
        .tab.red-active.active { background: var(--red); }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }
        .section-label { margin: 0 0 12px; font-size: 12px; font-weight: 900; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; }
        .card {
          background: var(--white); border-radius: 18px; padding: 14px 16px; margin-bottom: 12px;
          display: flex; align-items: center; gap: 14px; box-shadow: var(--shadow);
        }
        .avatar {
          width: 48px; height: 48px; border-radius: 50%; background: var(--green-tint);
          display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
        }
        .card.emerg .avatar { background: var(--red-tint); }
        .cbody { flex: 1; }
        .cbody h4 { margin: 0 0 2px; font-size: 14.5px; color: var(--ink); }
        .cbody p { margin: 0; color: var(--ink-soft); font-size: 11px; font-weight: 700; }
        .pill-btn {
          background: var(--green); color: #fff; border: none; border-radius: 13px; padding: 10px 14px;
          font-size: 12.5px; font-weight: 800; cursor: pointer; font-family: inherit; white-space: nowrap;
        }
        .pill-btn.red { background: var(--red); }
        .more-btn { background: none; border: none; color: var(--ink-soft); font-size: 20px; cursor: pointer; padding: 4px 6px; }
        .sos-card {
          background: var(--red); border-radius: 20px; padding: 18px; margin-bottom: 20px;
          box-shadow: 0 10px 22px rgba(179,63,51,0.35); text-align: center;
        }
        .sos-card button {
          width: 100%; background: rgba(255,255,255,0.16); border: none; border-radius: 16px;
          padding: 16px; font-size: 16px; font-weight: 900; color: #fff; cursor: pointer; font-family: inherit;
        }
        .sos-card p { color: #F6D9D4; font-size: 11.5px; font-weight: 700; margin: 10px 0 0; line-height: 1.5; }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 11px 14px; font-size: 12px; color: #7a5015; font-weight: 700; line-height: 1.5; margin: 6px 0 20px;
        }
        .caregiver-box { background: var(--white); border: 1.5px dashed #C7D3C9; border-radius: 18px; padding: 18px; text-align: center; }
        .caregiver-box h3 { margin: 0 0 4px; font-size: 13.5px; color: var(--ink); }
        .caregiver-box p { margin: 0 0 12px; color: var(--ink-soft); font-size: 11px; font-weight: 700; line-height: 1.4; }
        .lock-btn {
          background: var(--canvas); border: 1.5px solid #C7D3C9; color: var(--ink); border-radius: 12px;
          padding: 10px 18px; font-weight: 800; font-size: 12.5px; cursor: pointer; font-family: inherit;
        }
        .modal { display: flex; position: fixed; inset: 0; background: rgba(36,50,42,.45); align-items: center; justify-content: center; z-index: 100; }
        .modal-box { background: var(--white); border-radius: 20px; padding: 22px; width: 300px; max-width: 85%; }
        .modal-box h3 { margin: 0 0 14px; font-family: 'Fraunces', serif; font-style: italic; font-size: 16px; color: var(--ink); }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 11px; color: var(--ink-soft); margin-bottom: 5px; font-weight: 800; }
        .field input { width: 100%; padding: 10px; border-radius: 10px; border: 1.5px solid var(--green-tint); font-size: 13px; font-family: inherit; box-sizing: border-box; }
        .modal-btns { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
        .modal-btns button { padding: 11px; border-radius: 10px; border: none; font-weight: 800; cursor: pointer; font-family: inherit; font-size: 13px; }
        .modal-btns .save { background: var(--green); color: #fff; }
        .modal-btns .msg { background: var(--marigold); color: #fff; }
        .modal-btns .cancel { background: var(--canvas); color: var(--ink); border: 1px solid #C7D3C9; }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <div className="header-top">
              <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
              </button>
              <h1>Family &amp; Emergency</h1>
            </div>
            <div className="tabbar">
              <button className={`tab ${tab === 'family' ? 'active' : ''}`} onClick={() => setTab('family')}>👨‍👩‍👧 Family</button>
              <button className={`tab red-active ${tab === 'emergency' ? 'active' : ''}`} onClick={() => setTab('emergency')}>🚨 Emergency</button>
            </div>
          </div>

          <div className="content">
            {tab === 'family' ? (
              <div>
                <div className="section-label">Video call family</div>
                <div className="card">
                  <div className="avatar">👩</div>
                  <div className="cbody"><h4>Daughter Priya</h4><p>Usually free in the evening</p></div>
                  <button className="pill-btn" onClick={() => alert("Calling Priya...")}>📹 Video call</button>
                  <button className="more-btn" onClick={() => setModalType('options')}>⋯</button>
                </div>
                <div className="card">
                  <div className="avatar">👨</div>
                  <div className="cbody"><h4>Son Rahul</h4><p>Usually free after work</p></div>
                  <button className="pill-btn" onClick={() => alert("Calling Rahul...")}>📹 Video call</button>
                  <button className="more-btn" onClick={() => setModalType('options')}>⋯</button>
                </div>
                <div className="callout">One big button calls them over video right away. The small "⋯" opens a plain call or message instead, so the card stays simple.</div>

                <div className="caregiver-box">
                  <h3>🔒 Add or edit family members</h3>
                  <p>Set up once by a family member, not from here.</p>
                  <button className="lock-btn" onClick={() => setModalType('caregiver')}>Open caregiver settings</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="sos-card">
                  <button onClick={() => alert("🚨 Calling Emergency Services and Caregiver!")}>🚨 Call for help now</button>
                  <p>Calls your saved doctor immediately. No answer, and it tries the nurse next.</p>
                </div>

                <div className="section-label">Saved emergency contacts</div>
                <div className="card emerg">
                  <div className="avatar">🩺</div>
                  <div className="cbody"><h4>Dr. Sharma</h4><p>Family doctor</p></div>
                  <button className="pill-btn red" onClick={() => alert("Calling Dr. Sharma...")}>📞 Call</button>
                </div>
                <div className="card emerg">
                  <div className="avatar">💉</div>
                  <div className="cbody"><h4>Nurse Anjali</h4><p>Home visit nurse</p></div>
                  <button className="pill-btn red" onClick={() => alert("Calling Nurse Anjali...")}>📞 Call</button>
                </div>
                <div className="callout">Each contact has one button that always calls immediately. In an urgent moment, there's only one thing to decide.</div>

                <div className="caregiver-box">
                  <h3>🔒 Add or edit doctor / nurse</h3>
                  <p>Locked so it can't open by accident.</p>
                  <button className="lock-btn" onClick={() => setModalType('caregiver')}>Open caregiver settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalType === 'options' && (
        <div className="modal">
          <div className="modal-box">
            <h3>More ways to reach them</h3>
            <div className="modal-btns">
              <button className="save" onClick={() => setModalType(null)}>📞 Plain phone call</button>
              <button className="msg" onClick={() => setModalType(null)}>💬 Send a message</button>
              <button className="cancel" onClick={() => setModalType(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {modalType === 'caregiver' && (
        <div className="modal">
          <div className="modal-box">
            <h3>Caregiver settings</h3>
            <div className="field"><label>Name</label><input placeholder="e.g. Son Rahul" /></div>
            <div className="field"><label>Phone number</label><input placeholder="With country code" /></div>
            <div className="field"><label>Relationship</label><input placeholder="e.g. Doctor, Daughter" /></div>
            <div className="modal-btns">
              <button className="save" onClick={() => setModalType(null)}>Save</button>
              <button className="cancel" onClick={() => setModalType(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}