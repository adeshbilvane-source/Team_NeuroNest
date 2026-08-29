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
        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .wellness-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          padding: 16px 14px;
          min-height: 110px;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: transform .15s ease;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 8px 20px rgba(24, 38, 31, 0.12);
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(17, 22, 20, 0.46), rgba(17, 22, 20, 0.16));
          z-index: 1;
        }
        .card:active { transform: scale(0.97); }
        .card > * {
          position: relative;
          z-index: 2;
        }
        .card .label {
          font-weight: 800;
          font-size: 15px;
          color: #fff;
          line-height: 1.2;
        }
        .card .sub {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-top: 4px;
          line-height: 1.3;
        }
        .game-card-picture { background-image: url('/background%20photos/picture_identifier.png'); }
        .game-card-memory { background-image: url('/background%20photos/memory%20game.png'); }
        .game-card-jigsaw { background-image: url('/background%20photos/jigsaw.png'); }
        .game-card-sort { background-image: url('/background%20photos/button_sort.png'); }
        .game-card-yoga { background-image: url('/background%20photos/yoga.png'); min-height: 135px; padding-top: 20px; }
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
                <button className="card game-card-picture" onClick={() => navigate('/patient/games/identify-picture')}>
                  <div>
                    <div className="label">{t('games.pictureGame') || 'Picture game'}</div>
                    <div className="sub">{t('games.pictureDesc') || 'Name what you see'}</div>
                  </div>
                </button>

                <button className="card game-card-memory" onClick={() => navigate('/patient/games/memory-match')}>
                  <div>
                    <div className="label">{t('games.memoryCards') || 'Memory cards'}</div>
                    <div className="sub">{t('games.memoryDesc') || 'Find two alike'}</div>
                  </div>
                </button>

                <button className="card game-card-jigsaw" onClick={() => navigate('/patient/games/jigsaw')}>
                  <div>
                    <div className="label">{t('games.jigsaw') || 'Jigsaw'}</div>
                    <div className="sub">{t('games.jigsawDesc') || 'Put the picture together'}</div>
                  </div>
                </button>

                <button className="card game-card-sort" onClick={() => navigate('/patient/games/button-sorting')}>
                  <div>
                    <div className="label">{t('games.sortButtons') || 'Sort buttons'}</div>
                    <div className="sub">{t('games.sortDesc') || 'Match shape and colour'}</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Wellness</h2>
              <div className="wellness-grid">
                <button className="card game-card-yoga" onClick={() => navigate('/patient/yoga')}>
                  <div>
                    <div className="label">Yoga &amp; Rest</div>
                    <div className="sub">Gentle stretching and breathing</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
