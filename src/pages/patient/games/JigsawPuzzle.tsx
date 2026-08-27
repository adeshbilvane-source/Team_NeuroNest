import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JigsawPuzzle() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '']);

  const moveTile = (index: number) => {
    const emptyIdx = pieces.indexOf('');
    const validMoves = [index - 1, index + 1, index - 4, index + 4];

    if (validMoves.includes(emptyIdx)) {
      const updated = [...pieces];
      [updated[index], updated[emptyIdx]] = [updated[emptyIdx], updated[index]];
      setPieces(updated);
    }
  };

  return (
    <div className="game-sub-root">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --green: #3F6B4F; --green-tint: #E3EDE5;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA; --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .game-sub-root {
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
        .notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 120px; height: 24px; background: #111614; border-radius: 20px; z-index: 10; }
        .page-header { padding: 44px 18px 14px 18px; background: var(--white); box-shadow: var(--shadow); display: flex; align-items: center; gap: 12px; }
        .back-btn { width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }
        .chip-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .chip { background: var(--green); color: #fff; font-weight: 800; font-size: 12.5px; padding: 8px 14px; border-radius: 20px; }
        .puzzle-frame {
          width: 100%; aspect-ratio: 4/3; margin: 0 0 16px; display: grid;
          grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 1fr); gap: 4px;
          background: var(--green-tint); border-radius: 16px; overflow: hidden; padding: 4px; box-sizing: border-box;
        }
        .ptile {
          background: linear-gradient(135deg, var(--marigold-tint), #F0CE9A); border-radius: 8px;
          display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #8a5a1c; cursor: pointer;
        }
        .ptile.empty { background: transparent; cursor: default; }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 12px 14px; font-size: 12.5px; color: #7a5015; font-weight: 700; line-height: 1.5; margin-top: 16px;
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient/games')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <h1>Jigsaw Puzzle</h1>
          </div>

          <div className="content">
            <div className="chip-row">
              <div className="chip">Gentle Sliding Puzzle</div>
            </div>

            <div className="puzzle-frame">
              {pieces.map((val, i) => (
                <div
                  key={i}
                  className={`ptile ${val === '' ? 'empty' : ''}`}
                  onClick={() => moveTile(i)}
                >
                  {val}
                </div>
              ))}
            </div>

            <div className="callout">Tap adjacent tiles next to the empty spot to piece the picture back in order.</div>
          </div>
        </div>
      </div>
    </div>
  );
}