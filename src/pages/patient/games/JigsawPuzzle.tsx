import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type PuzzleMode = 'photo' | 'numbers';

interface PuzzleImage {
  id: string;
  name: string;
  url: string;
}

// 16+ Distinct, high-contrast, recognizable single-subject photos
const PUZZLE_IMAGES: PuzzleImage[] = [
  { id: 'img1', name: 'Golden Retriever Puppy', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80' },
  { id: 'img2', name: 'Bright Yellow Classic Car', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80' },
  { id: 'img3', name: 'Colorful Hot Air Balloon', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80' },
  { id: 'img4', name: 'Bright Sunflower in Sun', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80' },
  { id: 'img5', name: 'Majestic Royal Peacock', url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=600&auto=format&fit=crop&q=80' },
  { id: 'img6', name: 'Red Vintage Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80' },
  { id: 'img7', name: 'Indian Royal Elephant', url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80' },
  { id: 'img8', name: 'Serene Taj Mahal', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80' },
  { id: 'img9', name: 'Single Red Apple on White', url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80' },
  { id: 'img10', name: 'Cute Fluffy Kitten', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80' },
  { id: 'img11', name: 'Traditional Clay Tea Cup', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80' },
  { id: 'img12', name: 'Red Lighthouse by Sea', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80' },
  { id: 'img13', name: 'Colorful Macaw Parrot', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80' },
  { id: 'img14', name: 'Wooden Windmill in Green Field', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80' },
  { id: 'img15', name: 'White Aeroplane in Blue Sky', url: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=600&auto=format&fit=crop&q=80' },
  { id: 'img16', name: 'Peaceful Mountain Lake Cottage', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80' }
];

export default function JigsawPuzzle() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<PuzzleMode>('photo');
  const [level, setLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('sahayak_jigsaw_level') || '1', 10);
  });

  // Level Progression: 1-10 (2x2 = 4 pcs), 11-30 (3x3 = 9 pcs), 31+ (4x4 = 16 pcs)
  const gridSize = level > 30 ? 4 : level > 10 ? 3 : 2;
  const totalTiles = gridSize * gridSize;

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(() => (level - 1) % PUZZLE_IMAGES.length);
  const activeImage = PUZZLE_IMAGES[currentImageIndex % PUZZLE_IMAGES.length];

  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Playtime Analytics Tracker
  const sessionStartRef = useRef<number>(Date.now());

  const saveAnalyticsTime = () => {
    const elapsedSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    if (elapsedSeconds < 2) return;

    const minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60));
    const raw = localStorage.getItem('sahayak_game_analytics');
    const analytics = raw ? JSON.parse(raw) : {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (!analytics[todayKey]) analytics[todayKey] = {};
    if (!analytics[todayKey]['Jigsaw Puzzle']) {
      analytics[todayKey]['Jigsaw Puzzle'] = { minutes: 0, icon: '🧩', color: '#D98A2B' };
    }

    analytics[todayKey]['Jigsaw Puzzle'].minutes += minutesSpent;
    localStorage.setItem('sahayak_game_analytics', JSON.stringify(analytics));
    sessionStartRef.current = Date.now();
  };

  useEffect(() => {
    return () => saveAnalyticsTime();
  }, []);

  const checkSolved = (currentTiles: number[]) => {
    for (let i = 0; i < currentTiles.length; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return true;
  };

  const initPuzzle = () => {
    setIsWon(false);
    setSelectedIndex(null);

    const initial = Array.from({ length: totalTiles }, (_, i) => i);
    let shuffled = [...initial];

    do {
      shuffled = [...initial].sort(() => Math.random() - 0.5);
    } while (checkSolved(shuffled) && totalTiles > 1);

    setTiles(shuffled);
  };

  useEffect(() => {
    setCurrentImageIndex((level - 1) % PUZZLE_IMAGES.length);
    initPuzzle();
  }, [mode, level]);

  const handlePieceClick = (slotIdx: number) => {
    if (isWon) return;

    if (selectedIndex === null) {
      setSelectedIndex(slotIdx);
    } else if (selectedIndex === slotIdx) {
      setSelectedIndex(null);
    } else {
      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex];
      newTiles[selectedIndex] = newTiles[slotIdx];
      newTiles[slotIdx] = temp;

      setTiles(newTiles);
      setSelectedIndex(null);

      if (checkSolved(newTiles)) {
        setIsWon(true);
        saveAnalyticsTime();

        setTimeout(() => {
          if (level < 100) {
            const nextLvl = level + 1;
            setLevel(nextLvl);
            localStorage.setItem('sahayak_jigsaw_level', nextLvl.toString());
          }
        }, 1500);
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
          --red: #B33F33;
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

        .hint-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 12px; font-weight: 800; color: var(--ink-soft); }
        .hint-btn {
          background: var(--white); border: 1.5px solid var(--green-tint); border-radius: 12px;
          padding: 4px 10px; font-size: 11px; font-weight: 800; cursor: pointer; color: var(--green);
        }

        .puzzle-board {
          width: 100%; aspect-ratio: 1; margin: 0 auto 16px; display: grid; gap: 6px;
          background: #CAD5C6; border-radius: 22px; padding: 8px; box-sizing: border-box;
          box-shadow: var(--shadow); position: relative;
        }
        .ptile {
          border-radius: 14px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; overflow: hidden; background: var(--white);
          box-shadow: 0 3px 8px rgba(0,0,0,0.12); transition: transform 0.15s ease, border-color 0.2s, box-shadow 0.2s;
          user-select: none; border: 3px solid transparent;
        }
        .ptile:active { transform: scale(0.96); }
        .ptile.selected {
          border-color: var(--marigold); transform: scale(1.04);
          box-shadow: 0 6px 16px rgba(217, 138, 43, 0.45); z-index: 5;
        }
        .ptile.correct-spot {
          border-color: rgba(63, 107, 79, 0.3);
        }
        .ptile-tag {
          position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.6);
          color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;
        }

        .number-text {
          font-size: 32px; font-weight: 900; color: #8A5A1C; font-family: 'Fraunces', serif;
        }

        .preview-popup {
          position: fixed; inset: 0; background: rgba(36,50,42,0.6);
          display: flex; align-items: center; justify-content: center; z-index: 100;
        }
        .preview-card {
          background: var(--white); border-radius: 24px; padding: 18px; width: 300px;
          text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .preview-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 16px; margin-bottom: 12px; }

        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 12px 14px; font-size: 12px; color: #7a5015; font-weight: 800; line-height: 1.4;
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
              <h1>Jigsaw Puzzle</h1>
            </div>
            <div className="level-badge">⭐ Level {level} / 100</div>
          </div>

          <div className="content">
            <div className="chip-row">
              <div
                className={`chip ${mode === 'photo' ? 'active' : ''}`}
                onClick={() => setMode('photo')}
              >
                🖼️ Photo Jigsaw
              </div>
              <div
                className={`chip ${mode === 'numbers' ? 'active' : ''}`}
                onClick={() => setMode('numbers')}
              >
                🔢 Numbers
              </div>
            </div>

            <div className="hint-bar">
              <span>{gridSize}x{gridSize} Slices ({totalTiles} Pieces)</span>
              {mode === 'photo' && (
                <button className="hint-btn" onClick={() => setShowPreview(true)}>
                  👁️ View Full Photo
                </button>
              )}
            </div>

            {/* Tap-to-Swap Full Grid */}
            <div
              className="puzzle-board"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {tiles.map((sliceIdx, currentSlot) => {
                const isSelected = selectedIndex === currentSlot;
                const isCorrect = sliceIdx === currentSlot;

                if (mode === 'numbers') {
                  return (
                    <div
                      key={currentSlot}
                      className={`ptile ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct-spot' : ''}`}
                      style={{ background: 'linear-gradient(135deg, #FBEEDA 0%, #F5DEC0 100%)' }}
                      onClick={() => handlePieceClick(currentSlot)}
                    >
                      <span className="number-text">{sliceIdx + 1}</span>
                    </div>
                  );
                }

                // Slice CSS Math
                const origRow = Math.floor(sliceIdx / gridSize);
                const origCol = sliceIdx % gridSize;
                const pctX = gridSize > 1 ? (origCol / (gridSize - 1)) * 100 : 0;
                const pctY = gridSize > 1 ? (origRow / (gridSize - 1)) * 100 : 0;

                return (
                  <div
                    key={currentSlot}
                    className={`ptile ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct-spot' : ''}`}
                    style={{
                      backgroundImage: `url(${activeImage.url})`,
                      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                      backgroundPosition: `${pctX}% ${pctY}%`
                    }}
                    onClick={() => handlePieceClick(currentSlot)}
                  >
                    {isSelected && <span className="ptile-tag">Selected</span>}
                  </div>
                );
              })}
            </div>

            <div className="callout">
              {isWon
                ? `🎉 Completed! Level ${level + 1} unlocked with next picture!`
                : selectedIndex !== null
                ? `👉 Tap another piece to swap them into place.`
                : `Tap one piece to select, then tap another piece to swap.`}
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="preview-popup" onClick={() => setShowPreview(false)}>
          <div className="preview-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: 'var(--ink)' }}>Target Picture</h3>
            <img src={activeImage.url} alt={activeImage.name} className="preview-img" />
            <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 800, color: 'var(--ink-soft)' }}>
              {activeImage.name}
            </p>
            <button
              style={{
                background: 'var(--green)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              onClick={() => setShowPreview(false)}
            >
              Back to Puzzle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}