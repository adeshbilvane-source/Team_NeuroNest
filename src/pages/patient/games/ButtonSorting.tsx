import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type ModeType = 'shape' | 'color';

interface ButtonItem {
  id: number;
  shape: 'round' | 'square';
  color: string;
  colorName: string;
}

const COLOR_PALETTE = [
  { name: 'Orange', value: '#D98A2B' },
  { name: 'Green', value: '#3F6B4F' },
  { name: 'Red', value: '#B33F33' },
  { name: 'Blue', value: '#3E7FB8' }
];

export default function ButtonSorting() {
  const navigate = useNavigate();

  // Mode and Level
  const [mode, setMode] = useState<ModeType>('shape');
  const [level, setLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('sahayak_button_level') || '1', 10);
  });

  // Game Items Pool & Bins
  const [items, setItems] = useState<ButtonItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ButtonItem | null>(null);

  // Shape Bins
  const [roundBin, setRoundBin] = useState<ButtonItem[]>([]);
  const [squareBin, setSquareBin] = useState<ButtonItem[]>([]);

  // Color Bins
  const [colorBin1, setColorBin1] = useState<ButtonItem[]>([]);
  const [colorBin2, setColorBin2] = useState<ButtonItem[]>([]);
  const [colorTargets, setColorTargets] = useState<{ c1: typeof COLOR_PALETTE[0]; c2: typeof COLOR_PALETTE[0] }>({
    c1: COLOR_PALETTE[0],
    c2: COLOR_PALETTE[1]
  });

  const [feedback, setFeedback] = useState<string>('Select a button from above, then tap the matching bin below.');
  const [isError, setIsError] = useState<boolean>(false);

  // Analytics Tracker
  const sessionStartRef = useRef<number>(Date.now());

  const saveAnalyticsTime = () => {
    const elapsedSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    if (elapsedSeconds < 2) return;

    const minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60));
    const raw = localStorage.getItem('sahayak_game_analytics');
    const analytics = raw ? JSON.parse(raw) : {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (!analytics[todayKey]) analytics[todayKey] = {};
    if (!analytics[todayKey]['Button Sorting']) {
      analytics[todayKey]['Button Sorting'] = { minutes: 0, icon: '🔘', color: '#3E7FB8' };
    }

    analytics[todayKey]['Button Sorting'].minutes += minutesSpent;
    localStorage.setItem('sahayak_game_analytics', JSON.stringify(analytics));
    sessionStartRef.current = Date.now();
  };

  useEffect(() => {
    return () => saveAnalyticsTime();
  }, []);

  // Generate Level Items
  const generateLevel = () => {
    setSelectedItem(null);
    setRoundBin([]);
    setSquareBin([]);
    setColorBin1([]);
    setColorBin2([]);
    setIsError(false);
    setFeedback('Select a button from above, then tap the matching bin below.');

    // Count of buttons increases with level
    let count = 4;
    if (level > 25) count = 8;
    else if (level > 10) count = 6;

    if (mode === 'shape') {
      const generated: ButtonItem[] = [];
      for (let i = 0; i < count; i++) {
        const shape: 'round' | 'square' = Math.random() > 0.5 ? 'round' : 'square';
        const col = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        generated.push({
          id: Date.now() + i,
          shape,
          color: col.value,
          colorName: col.name
        });
      }
      setItems(generated);
    } else {
      // By color mode: pick 2 distinct colors for bins
      const shuffledColors = [...COLOR_PALETTE].sort(() => Math.random() - 0.5);
      const c1 = shuffledColors[0];
      const c2 = shuffledColors[1];
      setColorTargets({ c1, c2 });

      const generated: ButtonItem[] = [];
      for (let i = 0; i < count; i++) {
        const chosenCol = Math.random() > 0.5 ? c1 : c2;
        const shape: 'round' | 'square' = Math.random() > 0.5 ? 'round' : 'square';
        generated.push({
          id: Date.now() + i,
          shape,
          color: chosenCol.value,
          colorName: chosenCol.name
        });
      }
      setItems(generated);
    }
  };

  useEffect(() => {
    generateLevel();
  }, [mode, level]);

  // Step 1: User selects a button
  const handleSelectButton = (item: ButtonItem) => {
    setSelectedItem(item);
    setIsError(false);
    setFeedback(`Selected ${item.shape} (${item.colorName}). Now tap the target bin below.`);
  };

  // Step 2: User taps a bin to place the selected button
  const handlePlaceInBin = (binType: 'round' | 'square' | 'c1' | 'c2') => {
    if (!selectedItem) {
      setFeedback('⚠️ Please select a button from the top box first!');
      setIsError(true);
      return;
    }

    if (mode === 'shape') {
      if (selectedItem.shape === binType) {
        // Correct Choice
        if (binType === 'round') setRoundBin(prev => [...prev, selectedItem]);
        else setSquareBin(prev => [...prev, selectedItem]);

        const remaining = items.filter(i => i.id !== selectedItem.id);
        setItems(remaining);
        setSelectedItem(null);
        setIsError(false);
        setFeedback('✅ Correct! Pick another button.');

        // Level Cleared
        if (remaining.length === 0) {
          saveAnalyticsTime();
          setFeedback('🎉 Level Complete! Loading next level...');
          setTimeout(() => {
            if (level < 100) {
              const nextLvl = level + 1;
              setLevel(nextLvl);
              localStorage.setItem('sahayak_button_level', nextLvl.toString());
            } else {
              generateLevel();
            }
          }, 1200);
        }
      } else {
        // Wrong Bin Choice
        setIsError(true);
        setFeedback(`❌ Incorrect bin! This is a ${selectedItem.shape} shape.`);
      }
    } else {
      // Color Mode Check
      const targetColor = binType === 'c1' ? colorTargets.c1.name : colorTargets.c2.name;
      if (selectedItem.colorName === targetColor) {
        if (binType === 'c1') setColorBin1(prev => [...prev, selectedItem]);
        else setColorBin2(prev => [...prev, selectedItem]);

        const remaining = items.filter(i => i.id !== selectedItem.id);
        setItems(remaining);
        setSelectedItem(null);
        setIsError(false);
        setFeedback('✅ Correct! Pick another button.');

        if (remaining.length === 0) {
          saveAnalyticsTime();
          setFeedback('🎉 Level Complete! Loading next level...');
          setTimeout(() => {
            if (level < 100) {
              const nextLvl = level + 1;
              setLevel(nextLvl);
              localStorage.setItem('sahayak_button_level', nextLvl.toString());
            } else {
              generateLevel();
            }
          }, 1200);
        }
      } else {
        setIsError(true);
        setFeedback(`❌ Incorrect color bin! This button is ${selectedItem.colorName}.`);
      }
    }
  };

  return (
    <div className="game-sub-root">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --marigold: #D98A2B;
          --marigold-tint: #FBEEDA; --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --red-tint: #FBE8E6;
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
        .page-header {
          padding: 44px 18px 14px 18px; background: var(--white); box-shadow: var(--shadow);
          display: flex; align-items: center; justify-content: space-between; z-index: 2;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 19px; color: var(--ink); margin: 0; }
        .level-badge {
          background: var(--marigold-tint); border: 1.5px solid var(--marigold);
          color: #8A5A1C; font-weight: 900; font-size: 12px; padding: 4px 10px; border-radius: 20px;
        }
        .content { flex: 1; overflow-y: auto; padding: 16px 18px 24px 18px; }

        .chip-row { display: flex; gap: 8px; margin-bottom: 14px; }
        .chip {
          background: var(--white); border: 1.5px solid var(--green-tint); color: var(--green);
          font-weight: 800; font-size: 12.5px; padding: 8px 16px; border-radius: 20px; cursor: pointer;
        }
        .chip.active { background: var(--green); color: #fff; border-color: var(--green); }

        /* Button Selection Pool */
        .sort-pool {
          display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; align-items: center;
          padding: 16px 14px; background: var(--white); border-radius: 22px;
          box-shadow: var(--shadow); margin-bottom: 18px; min-height: 70px;
          border: 2px solid var(--green-tint);
        }
        .btn-obj {
          width: 52px; height: 52px; border-radius: 50%; cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: all 0.2s ease;
          border: 3px solid transparent; box-sizing: border-box;
        }
        .btn-obj.sq { border-radius: 14px; }
        .btn-obj.selected {
          border-color: #111614; transform: scale(1.15); box-shadow: 0 8px 16px rgba(0,0,0,0.25);
        }

        /* Bin Target Areas */
        .bin-row { display: flex; gap: 12px; margin-bottom: 14px; }
        .bin {
          flex: 1; min-height: 140px; background: var(--white);
          border: 2.5px dashed var(--green); border-radius: 22px; padding: 12px 10px;
          display: flex; flex-direction: column; align-items: center; cursor: pointer;
          transition: transform 0.15s ease, background-color 0.2s;
          box-sizing: border-box;
        }
        .bin:hover { background: var(--green-tint); }
        .bin:active { transform: scale(0.98); }
        .bin h4 { margin: 0 0 10px 0; font-size: 13.5px; color: var(--ink); font-weight: 900; }
        .bin-contents { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; width: 100%; }

        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 12px 14px; font-size: 12px; color: #7a5015; font-weight: 800; line-height: 1.4;
        }
        .callout.error {
          background: var(--red-tint); border-left-color: var(--red); color: var(--red);
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <div className="header-left">
              <button
                className="back-btn"
                onClick={() => {
                  saveAnalyticsTime();
                  navigate('/patient/games');
                }}
                aria-label="Back"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <h1>Button Sorting</h1>
            </div>
            <div className="level-badge">⭐ Level {level} / 100</div>
          </div>

          <div className="content">
            <div className="chip-row">
              <div
                className={`chip ${mode === 'shape' ? 'active' : ''}`}
                onClick={() => setMode('shape')}
              >
                By shape
              </div>
              <div
                className={`chip ${mode === 'color' ? 'active' : ''}`}
                onClick={() => setMode('color')}
              >
                By colour
              </div>
            </div>

            {/* Top Selection Box */}
            <div className="sort-pool">
              {items.length === 0 ? (
                <p style={{ color: 'var(--green)', fontWeight: 900, margin: 0 }}>🎉 Level Completed!</p>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    className={`btn-obj ${item.shape === 'square' ? 'sq' : ''} ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    style={{ background: item.color }}
                    onClick={() => handleSelectButton(item)}
                  />
                ))
              )}
            </div>

            {/* Target Drop Bins */}
            {mode === 'shape' ? (
              <div className="bin-row">
                <div className="bin" onClick={() => handlePlaceInBin('round')}>
                  <h4>◯ Round ({roundBin.length})</h4>
                  <div className="bin-contents">
                    {roundBin.map(b => (
                      <div key={b.id} className="btn-obj" style={{ background: b.color, width: 26, height: 26 }} />
                    ))}
                  </div>
                </div>

                <div className="bin" onClick={() => handlePlaceInBin('square')}>
                  <h4>◻ Square ({squareBin.length})</h4>
                  <div className="bin-contents">
                    {squareBin.map(b => (
                      <div key={b.id} className="btn-obj sq" style={{ background: b.color, width: 26, height: 26 }} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bin-row">
                <div className="bin" onClick={() => handlePlaceInBin('c1')} style={{ borderColor: colorTargets.c1.value }}>
                  <h4>🎨 {colorTargets.c1.name} ({colorBin1.length})</h4>
                  <div className="bin-contents">
                    {colorBin1.map(b => (
                      <div key={b.id} className={`btn-obj ${b.shape === 'square' ? 'sq' : ''}`} style={{ background: b.color, width: 26, height: 26 }} />
                    ))}
                  </div>
                </div>

                <div className="bin" onClick={() => handlePlaceInBin('c2')} style={{ borderColor: colorTargets.c2.value }}>
                  <h4>🎨 {colorTargets.c2.name} ({colorBin2.length})</h4>
                  <div className="bin-contents">
                    {colorBin2.map(b => (
                      <div key={b.id} className={`btn-obj ${b.shape === 'square' ? 'sq' : ''}`} style={{ background: b.color, width: 26, height: 26 }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={`callout ${isError ? 'error' : ''}`}>
              {feedback}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}