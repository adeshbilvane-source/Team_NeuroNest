import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sets: Record<number, string[]> = {
  0: ['🍎', '🍌', '🥕', '🍇', '🥔', '🍊'],
  1: ['🔺', '🔵', '⬛', '⭐', '🔶', '⬜'],
  2: ['🔑', '🧴', '🧦', '🪥', '🕯️', '🧵'],
  3: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']
};

export default function MemoryMatch() {
  const navigate = useNavigate();
  const [catIdx, setCatIdx] = useState<number>(0);
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const buildMemory = (idx: number) => {
    setCatIdx(idx);
    const chosen = sets[idx];
    const cards = [...chosen, ...chosen].sort(() => Math.random() - 0.5);
    setDeck(cards);
    setFlipped([]);
    setMatched([]);
  };

  useEffect(() => {
    buildMemory(0);
  }, []);

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [first, second] = nextFlipped;
      if (deck[first] === deck[second]) {
        setMatched(prev => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
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
        .cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
        .cat-chip {
          background: var(--white); border-radius: 14px; padding: 12px 8px; text-align: center;
          font-size: 13px; font-weight: 800; color: var(--ink); box-shadow: var(--shadow); cursor: pointer; border: 2px solid transparent;
        }
        .cat-chip.active { border-color: var(--marigold); background: var(--marigold-tint); color: #8a5a1c; }
        .match-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
        .mtile {
          aspect-ratio: 1; background: var(--green); border-radius: 12px; display: flex;
          align-items: center; justify-content: center; font-size: 24px; color: #fff; cursor: pointer;
        }
        .mtile.flipped { background: var(--white); border: 2px solid var(--green-tint); color: var(--ink); }
        .mtile.matched { background: var(--green-tint); border: 2px solid var(--green); color: var(--green); }
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
            <h1>Memory Match</h1>
          </div>

          <div className="content">
            <div className="cat-grid">
              {['🍇 Fruits & Veg', '🔷 Shapes', '🧺 Household', '🔢 Numbers'].map((name, i) => (
                <div key={i} className={`cat-chip ${catIdx === i ? 'active' : ''}`} onClick={() => buildMemory(i)}>
                  {name}
                </div>
              ))}
            </div>

            <div className="match-grid">
              {deck.map((val, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`mtile ${isFlipped ? 'flipped' : ''} ${matched.includes(idx) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(idx)}
                  >
                    {isFlipped ? val : '?'}
                  </div>
                );
              })}
            </div>

            <div className="callout">Flip two cards to find a pair. Matches stay open — everything else flips back.</div>
          </div>
        </div>
      </div>
    </div>
  );
}