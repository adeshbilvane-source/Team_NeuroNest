import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="activity-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .activity-root-container {
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
        .section {
          margin-bottom: 18px;
        }
        .section-title {
          font-size: 15px; font-weight: 900; letter-spacing: 0.04em; color: var(--green-dark);
          margin: 0 0 12px 4px; text-transform: uppercase;
        }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .card {
          background: var(--green-tint); border-radius: 20px; padding: 16px 14px;
          display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
          min-height: 110px; border: none; cursor: pointer; text-align: left; transition: transform .15s ease; width: 100%; box-sizing: border-box;
        }
        .card:active { transform: scale(0.97); }
        .card .icon-wrap {
          width: 44px; height: 44px; border-radius: 13px; background: var(--white);
          display: flex; align-items: center; justify-content: center; font-size: 22px;
        }
        .card .label { font-weight: 800; font-size: 15px; color: var(--ink); }
        .card .sub { font-size: 11px; font-weight: 700; color: var(--ink-soft); margin-top: 2px; }
        .yoga-card {
          background: linear-gradient(135deg, #edf7ee, #e5f0ff);
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch" />

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <h1>{t('games.title') || 'Activity'}</h1>
          </div>

          <div className="content">
            <div className="section">
              <h2 className="section-title">Games</h2>
              <div className="grid2">
                <button className="card" onClick={() => navigate('/patient/games/identify-picture')}>
                  <div className="icon-wrap">🖼️</div>
                  <div><div className="label">{t('games.pictureGame') || 'Identify Picture'}</div><div className="sub">{t('games.pictureDesc') || 'Spot the right image'}</div></div>
                </button>
                <button className="card" onClick={() => navigate('/patient/games/memory-match')}>
                  <div className="icon-wrap">🃏</div>
                  <div><div className="label">{t('games.memoryCards') || 'Memory Match'}</div><div className="sub">{t('games.memoryDesc') || 'Find matching cards'}</div></div>
                </button>
                <button className="card" onClick={() => navigate('/patient/games/jigsaw')}>
                  <div className="icon-wrap">🧩</div>
                  <div><div className="label">{t('games.jigsaw') || 'Jigsaw Puzzle'}</div><div className="sub">{t('games.jigsawDesc') || 'Complete the picture'}</div></div>
                </button>
                <button className="card" onClick={() => navigate('/patient/games/button-sorting')}>
                  <div className="icon-wrap">🔘</div>
                  <div><div className="label">{t('games.sortButtons') || 'Button Sorting'}</div><div className="sub">{t('games.sortDesc') || 'Sort the correct buttons'}</div></div>
                </button>
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Wellness</h2>
              <div className="grid2">
                <button className="card yoga-card" onClick={() => navigate('/patient/yoga')}>
                  <div className="icon-wrap">🧘</div>
                  <div><div className="label">Yoga &amp; Rest</div><div className="sub">Gentle stretching and breathing</div></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
