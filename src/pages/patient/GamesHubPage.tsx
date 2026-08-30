import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function GamesHubPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="game-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --card-overlay: linear-gradient(135deg, rgba(30,40,35,0.44), rgba(30,40,35,0.18));
        }
        .game-root-container {
          display: flex; align-items: center; justify-content: center; min-height: 100vh;
          width: 100%; background: #DCE3D6; padding: 16px; box-sizing: border-box; font-family: 'Nunito', sans-serif;
        }
        .phone-wrapper {
          width: 100%; max-width: 390px; background: #111614; border-radius: 46px;
          padding: 14px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35); box-sizing: border-box;
        }
        .phone-screen {
          background-image: linear-gradient(rgba(243,246,240,0.78), rgba(243,246,240,0.82)), url('/background photos/activity.jpeg');
          background-size: cover; background-position: center; background-repeat: no-repeat;
          border-radius: 34px; overflow: hidden; position: relative; min-height: 780px; display: flex; flex-direction: column; box-sizing: border-box;
        }
        .notch {
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
          width: 120px; height: 24px; background: #111614; border-radius: 20px; z-index: 10;
        }
        .page-header {
          padding: 44px 18px 14px 18px; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px);
          box-shadow: var(--shadow); display: flex; align-items: center; gap: 12px; z-index: 2;
        }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }
        .lede { font-size: 13px; font-weight: 700; color: var(--ink-soft); margin: 0 0 16px; line-height: 1.5; }
        
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .card {
          position: relative; overflow: hidden; border-radius: 20px; padding: 16px 14px;
          display: flex; flex-direction: column; align-items: flex-start; gap: 20px;
          min-height: 110px; border: none; cursor: pointer; text-align: left; transition: transform .15s ease; width: 100%; box-sizing: border-box;
          background-size: cover; background-position: center; background-repeat: no-repeat;
        }
        .card::before { content: ''; position: absolute; inset: 0; background: var(--card-overlay); z-index: 1; }
        .card:active { transform: scale(0.97); }
        .card > * { position: relative; z-index: 2; }
        .card .label { font-weight: 800; font-size: 15px; color: #fff; }
        .card .sub { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.92); margin-top: 2px; }
        
        /* Background URLs exactly matching your folder structure */
        .game-card-picture { background-image: url('/background photos/picture_identifier.png'); }
        .game-card-memory { background-image: url('/background photos/memory game.png'); }
        .game-card-jigsaw { background-image: url('/background photos/jigsaw.png'); } 
        .game-card-sort { background-image: url('/background photos/button_sort.png'); }

        .yoga-card {
          margin-top: 18px;
          border-radius: 20px;
          width: 100%;
          min-height: 160px; 
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background-image: url('/background photos/yoga.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: left;
          transition: transform .15s ease;
        }
        .yoga-card:active { transform: scale(0.97); }
        .yoga-card .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%);
          z-index: 1;
        }
        .yoga-card .content-text {
          position: absolute;
          bottom: 16px;
          left: 18px;
          right: 18px;
          z-index: 2;
          color: white;
        }
        .yoga-card .label { font-weight: 800; font-size: 18px; }
        .yoga-card .sub { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); margin-top: 4px; }

      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <h1>{t('games.title')}</h1>
          </div>

          <div className="content">
            <p className="lede">{t('games.pickOne')}</p>
            
            <div className="grid2">
              <button id="gameshub-picture-game" data-guide-id="gameshub-picture-game" className="card game-card-picture" onClick={() => navigate('/patient/games/identify-picture')}>
                <div className="label">{t('games.pictureGame')}</div>
                <div className="sub">{t('games.pictureDesc')}</div>
              </button>
              <button id="gameshub-memory-cards" data-guide-id="gameshub-memory-cards" className="card game-card-memory" onClick={() => navigate('/patient/games/memory-match')}>
                <div className="label">{t('games.memoryCards')}</div>
                <div className="sub">{t('games.memoryDesc')}</div>
              </button>
              <button id="gameshub-jigsaw" data-guide-id="gameshub-jigsaw" className="card game-card-jigsaw" onClick={() => navigate('/patient/games/jigsaw')}>
                <div className="label">{t('games.jigsaw')}</div>
                <div className="sub">{t('games.jigsawDesc')}</div>
              </button>
              <button id="gameshub-sort-buttons" data-guide-id="gameshub-sort-buttons" className="card game-card-sort" onClick={() => navigate('/patient/games/button-sorting')}>
                <div className="label">{t('games.sortButtons')}</div>
                <div className="sub">{t('games.sortDesc')}</div>
              </button>
            </div>

            <button id="gameshub-yoga" data-guide-id="gameshub-yoga" className="yoga-card" onClick={() => navigate('/patient/yoga')}>
              <div className="overlay"></div>
              <div className="content-text">
                <div className="label">Yoga & Rest</div>
                <div className="sub">Explore guided sessions for strength and peace</div>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}