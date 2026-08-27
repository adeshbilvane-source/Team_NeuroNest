import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Pose {
  icon: string;
  chipTitle: string;
  title: string;
  steps: string[];
}

export default function YogaPage() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const poses: Pose[] = [
    {
      icon: '🧘',
      chipTitle: 'Mountain Pose',
      title: 'Mountain Pose (Tadasana)',
      steps: [
        'Stand tall with your feet a little apart.',
        'Let your arms rest gently by your sides.',
        'Take a slow breath in, and lift your chest a little.',
        'Breathe out slowly, and relax your shoulders.',
        'Stay here for a few calm breaths.'
      ]
    },
    {
      icon: '🙇',
      chipTitle: 'Seated Forward Bend',
      title: 'Seated Forward Bend',
      steps: [
        'Sit comfortably on a chair or the floor.',
        'Rest your hands on your knees.',
        'Breathe in, and sit up a little taller.',
        'Breathe out, and lean gently forward.',
        'Come back up slowly whenever ready.'
      ]
    },
    {
      icon: '🪑',
      chipTitle: 'Chair Twist',
      title: 'Gentle Chair Twist',
      steps: [
        'Sit sideways on a sturdy chair.',
        'Hold the back of the chair with both hands.',
        'Breathe in, and sit up tall.',
        'Breathe out, and turn gently towards the chair back.',
        'Return to facing forward slowly.'
      ]
    },
    {
      icon: '🐈',
      chipTitle: 'Cat-Cow Stretch',
      title: 'Cat-Cow Stretch',
      steps: [
        'Sit tall with your hands resting on your knees.',
        'Breathe in, gently arch your back and lift your chin.',
        'Breathe out, round your back and drop your chin.',
        'Move slowly between the two, following your breath.',
        'Stop whenever you feel ready.'
      ]
    }
  ];

  const currentPose = poses[activeIdx];

  return (
    <div className="yoga-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .yoga-root-container {
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
        .lede { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); margin: 0 0 16px; line-height: 1.5; text-align: center; }
        .pose-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 18px; }
        .pose-chip { flex-shrink: 0; width: 84px; text-align: center; cursor: pointer; }
        .pose-chip .ph {
          width: 100%; aspect-ratio: 1; border-radius: 18px; background: var(--green-tint);
          display: flex; align-items: center; justify-content: center; font-size: 30px; border: 3px solid transparent;
        }
        .pose-chip.active .ph { border-color: var(--green); background: #D6E7DA; }
        .pose-chip p { margin: 8px 0 0; font-size: 10.5px; font-weight: 800; color: var(--ink); line-height: 1.3; }
        .detail { background: var(--white); border-radius: 22px; padding: 20px; box-shadow: var(--shadow); }
        .detail .ph {
          width: 100%; aspect-ratio: 16/9; border-radius: 16px; background: linear-gradient(135deg,var(--green-tint),#BFDBCB);
          display: flex; align-items: center; justify-content: center; font-size: 44px; margin-bottom: 16px;
        }
        .detail h2 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; color: var(--green-dark); font-size: 19px; margin: 0 0 14px; text-align: center; }
        .detail ol { padding-left: 20px; margin: 0 0 18px; }
        .detail li { margin-bottom: 9px; font-size: 13.5px; color: var(--ink); font-weight: 700; line-height: 1.4; }
        .start-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: var(--green);
          color: #fff; border: none; border-radius: 16px; padding: 15px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit;
        }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 11px 14px; font-size: 12px; color: #7a5015; font-weight: 700; line-height: 1.5; margin-top: 16px;
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <h1>Yoga</h1>
          </div>

          <div className="content">
            <p className="lede">Simple, gentle poses guided step by step, by voice — your eyes stay free to follow along.</p>

            <div className="pose-row">
              {poses.map((p, idx) => (
                <div
                  key={idx}
                  className={`pose-chip ${activeIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <div className="ph">{p.icon}</div>
                  <p>{p.chipTitle}</p>
                </div>
              ))}
            </div>

            <div className="detail">
              <div className="ph">{currentPose.icon}</div>
              <h2>{currentPose.title}</h2>
              <ol>
                {currentPose.steps.map((s, sIdx) => (
                  <li key={sIdx}>{s}</li>
                ))}
              </ol>
              <button className="start-btn" onClick={() => alert("Starting voice guided session...")}>
                ▶ Start guided session
              </button>
            </div>
            <div className="callout">Only one pose shows at a time, so there's nothing else to lose your place. The guide reads each step aloud and waits before moving on.</div>
          </div>
        </div>
      </div>
    </div>
  );
}