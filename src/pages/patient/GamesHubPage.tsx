import { useNavigate } from 'react-router-dom';

export default function GamesHubPage() {
  const navigate = useNavigate();

  return (
    <div className="game-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
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
        .lede { font-size: 13px; font-weight: 700; color: var(--ink-soft); margin: 0 0 16px; line-height: 1.5; }
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
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <h1>Games</h1>
          </div>

          <div className="content">
            <p className="lede">Short, gentle games you can stop anytime.</p>
            <div className="grid2">
              <button className="card" onClick={() => navigate('/patient/games/identify-picture')}>
                <div className="icon-wrap">🖼️</div>
                <div><div className="label">Identify Picture</div><div className="sub">Name what you see</div></div>
              </button>
              <button className="card" onClick={() => navigate('/patient/games/memory-match')}>
                <div className="icon-wrap">🃏</div>
                <div><div className="label">Memory Match</div><div className="sub">Find the matching pair</div></div>
              </button>
              <button className="card" onClick={() => navigate('/patient/games/jigsaw')}>
                <div className="icon-wrap">🧩</div>
                <div><div className="label">Jigsaw Puzzle</div><div className="sub">Piece it back together</div></div>
              </button>
              <button className="card" onClick={() => navigate('/patient/games/button-sorting')}>
                <div className="icon-wrap">🔘</div>
                <div><div className="label">Button Sorting</div><div className="sub">Sort by shape, size, colour</div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}