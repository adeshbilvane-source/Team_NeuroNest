import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonItem {
  id: number;
  shape: 'round' | 'square';
  color: string;
}

export default function ButtonSorting() {
  const navigate = useNavigate();
  const [chip, setChip] = useState<'shape' | 'color'>('shape');
  const [items, setItems] = useState<ButtonItem[]>([
    { id: 1, shape: 'round', color: 'var(--marigold)' },
    { id: 2, shape: 'square', color: 'var(--green)' },
    { id: 3, shape: 'round', color: '#B33F33' },
    { id: 4, shape: 'square', color: '#7a8fd6' },
    { id: 5, shape: 'round', color: '#F0CE9A' }
  ]);
  const [roundBin, setRoundBin] = useState<ButtonItem[]>([]);
  const [squareBin, setSquareBin] = useState<ButtonItem[]>([]);

  const handleSort = (item: ButtonItem, target: 'round' | 'square') => {
    if (item.shape === target) {
      if (target === 'round') setRoundBin(prev => [...prev, item]);
      else setSquareBin(prev => [...prev, item]);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      alert("Try dropping it in the other bin!");
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
        .chip {
          background: var(--white); border: 1.5px solid var(--green-tint); color: var(--green);
          font-weight: 800; font-size: 12.5px; padding: 8px 14px; border-radius: 20px; cursor: pointer;
        }
        .chip.active { background: var(--green); color: #fff; border-color: var(--green); }
        .sort-pool {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; padding: 16px;
          background: var(--white); border-radius: 16px; box-shadow: var(--shadow); margin-bottom: 16px; min-height: 60px;
        }
        .btn-obj { width: 44px; height: 44px; border-radius: 50%; cursor: pointer; }
        .btn-obj.sq { border-radius: 10px; }
        .bin-row { display: flex; gap: 12px; }
        .bin {
          flex: 1; min-height: 120px; background: var(--white); border: 2px dashed var(--green);
          border-radius: 16px; padding: 12px; text-align: center;
        }
        .bin h4 { margin: 0 0 10px; font-size: 13px; color: var(--ink); font-weight: 800; }
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
            <h1>Button Sorting</h1>
          </div>

          <div className="content">
            <div className="chip-row">
              <div className={`chip ${chip === 'shape' ? 'active' : ''}`} onClick={() => setChip('shape')}>By shape</div>
              <div className={`chip ${chip === 'color' ? 'active' : ''}`} onClick={() => setChip('color')}>By colour</div>
            </div>

            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>Tap a button below to sort it into the right bin:</p>

            <div className="sort-pool">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`btn-obj ${item.shape === 'square' ? 'sq' : ''}`}
                  style={{ background: item.color }}
                  onClick={() => handleSort(item, item.shape)}
                />
              ))}
              {items.length === 0 && <p style={{ color: 'var(--green)', fontWeight: 800 }}>🎉 All buttons sorted!</p>}
            </div>

            <div className="bin-row">
              <div className="bin">
                <h4>◯ Round ({roundBin.length})</h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {roundBin.map(b => <div key={b.id} className="btn-obj" style={{ background: b.color, width: 28, height: 28 }} />)}
                </div>
              </div>
              <div className="bin">
                <h4>◻ Square ({squareBin.length})</h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {squareBin.map(b => <div key={b.id} className="btn-obj sq" style={{ background: b.color, width: 28, height: 28 }} />)}
                </div>
              </div>
            </div>

            <div className="callout">Tap each button to sort it into the matching shape bin.</div>
          </div>
        </div>
      </div>
    </div>
  );
}