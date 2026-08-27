import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type CategoryType = 'fruits' | 'shapes' | 'household' | 'numbers';

interface CardItem {
  id: string;
  name: string;
  image: string;
}

const REAL_DATASETS: Record<CategoryType, CardItem[]> = {
  fruits: [
    { id: 'f1', name: 'Apple', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80' },
    { id: 'f2', name: 'Banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80' },
    { id: 'f3', name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80' },
    { id: 'f4', name: 'Grapes', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format&fit=crop&q=80' },
    { id: 'f5', name: 'Orange', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop&q=80' },
    { id: 'f6', name: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80' }
  ],
  shapes: [
    { id: 's1', name: 'Circle', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80' },
    { id: 's2', name: 'Triangle', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80' },
    { id: 's3', name: 'Cube', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80' },
    { id: 's4', name: 'Star', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80' },
    { id: 's5', name: 'Hexagon', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80' },
    { id: 's6', name: 'Diamond', image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400&auto=format&fit=crop&q=80' }
  ],
  household: [
    { id: 'h1', name: 'Key', image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=80' },
    { id: 'h2', name: 'Clock', image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&auto=format&fit=crop&q=80' },
    { id: 'h3', name: 'Cup', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80' },
    { id: 'h4', name: 'Chair', image: 'https://images.unsplash.com/photo-1580481077195-c328ad026076?w=400&auto=format&fit=crop&q=80' },
    { id: 'h5', name: 'Lamp', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80' },
    { id: 'h6', name: 'Book', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80' }
  ],
  numbers: [
    { id: 'n1', name: 'One', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&auto=format&fit=crop&q=80' },
    { id: 'n2', name: 'Two', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80' },
    { id: 'n3', name: 'Three', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80' },
    { id: 'n4', name: 'Four', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80' },
    { id: 'n5', name: 'Five', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
    { id: 'n6', name: 'Six', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80' }
  ]
};

export default function MemoryMatch() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState<CategoryType>('fruits');

  // Separate level persistence per category (1-100)
  const [levels, setLevels] = useState<Record<CategoryType, number>>(() => ({
    fruits: parseInt(localStorage.getItem('sahayak_mem_lvl_fruits') || '1', 10),
    shapes: parseInt(localStorage.getItem('sahayak_mem_lvl_shapes') || '1', 10),
    household: parseInt(localStorage.getItem('sahayak_mem_lvl_household') || '1', 10),
    numbers: parseInt(localStorage.getItem('sahayak_mem_lvl_numbers') || '1', 10)
  }));

  const currentLevel = levels[selectedCat];

  const [deck, setDeck] = useState<{ uid: string; item: CardItem }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isWon, setIsWon] = useState<boolean>(false);

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
    if (!analytics[todayKey]['Memory Match']) {
      analytics[todayKey]['Memory Match'] = { minutes: 0, icon: '🃏', color: '#3F6B4F' };
    }

    analytics[todayKey]['Memory Match'].minutes += minutesSpent;
    localStorage.setItem('sahayak_game_analytics', JSON.stringify(analytics));
    sessionStartRef.current = Date.now();
  };

  useEffect(() => {
    return () => saveAnalyticsTime();
  }, []);

  // Board Setup based on current Level
  const initBoard = () => {
    setFlipped([]);
    setMatched([]);
    setIsWon(false);

    let pairCount = 2; // Default for Level 1-5: 4 Cards total (2 pairs)
    if (currentLevel > 35) pairCount = 6;      // 12 Cards (6 pairs)
    else if (currentLevel > 15) pairCount = 4; // 8 Cards (4 pairs)
    else if (currentLevel > 5) pairCount = 3;  // 6 Cards (3 pairs)

    const pool = REAL_DATASETS[selectedCat];
    const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const combined = [...picked, ...picked].sort(() => Math.random() - 0.5);

    setDeck(combined.map((item, i) => ({ uid: `${item.id}-${i}-${Date.now()}`, item })));
  };

  useEffect(() => {
    initBoard();
  }, [selectedCat, currentLevel]);

  // Handle Card Flip
  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [first, second] = nextFlipped;
      if (deck[first].item.name === deck[second].item.name) {
        const nextMatched = [...matched, first, second];
        setMatched(nextMatched);
        setFlipped([]);

        // Board Cleared (Level Up)
        if (nextMatched.length === deck.length && deck.length > 0) {
          setIsWon(true);
          saveAnalyticsTime();

          setTimeout(() => {
            if (currentLevel < 100) {
              const nextLvl = currentLevel + 1;
              const updated = { ...levels, [selectedCat]: nextLvl };
              setLevels(updated);

              const keyMap: Record<CategoryType, string> = {
                fruits: 'sahayak_mem_lvl_fruits',
                shapes: 'sahayak_mem_lvl_shapes',
                household: 'sahayak_mem_lvl_household',
                numbers: 'sahayak_mem_lvl_numbers'
              };
              localStorage.setItem(keyMap[selectedCat], nextLvl.toString());
            }
            initBoard();
          }, 1400);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  // Determine Grid Style based on Card Count
  const getGridColumns = () => {
    if (deck.length === 4) return '1fr 1fr';
    if (deck.length === 6) return 'repeat(3, 1fr)';
    if (deck.length === 8) return 'repeat(4, 1fr)';
    return 'repeat(4, 1fr)';
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

        /* Category Select Grid */
        .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .cat-chip {
          background: var(--white); border-radius: 14px; padding: 10px 8px; text-align: center;
          font-size: 12.5px; font-weight: 800; color: var(--ink); box-shadow: var(--shadow); cursor: pointer; border: 2px solid transparent;
        }
        .cat-chip.active { border-color: var(--marigold); background: var(--marigold-tint); color: #8A5A1C; }

        /* Dynamic Cards Grid */
        .match-grid-container {
          display: grid;
          gap: 10px;
          margin-bottom: 16px;
        }
        .mtile {
          aspect-ratio: 1; border-radius: 16px; background: var(--green);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: var(--shadow); overflow: hidden; position: relative; border: 2px solid transparent;
          transition: transform 0.2s ease;
        }
        .mtile:active { transform: scale(0.96); }
        .mtile-front {
          font-size: 32px; font-weight: 900; color: #fff;
        }
        .mtile-img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .mtile.flipped {
          background: var(--white); border-color: var(--green-tint);
        }
        .mtile.matched {
          border-color: var(--green); box-shadow: 0 0 0 3px var(--green-tint);
        }

        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 10px 12px; font-size: 11.5px; color: #7a5015; font-weight: 700; line-height: 1.4; margin-top: 14px;
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
              <h1>Memory Match</h1>
            </div>
            <div className="level-badge">⭐ Level {currentLevel} / 100</div>
          </div>

          <div className="content">
            <div className="cat-grid">
              {(
                [
                  { key: 'fruits', label: '🍇 Fruits & Veg' },
                  { key: 'shapes', label: '🔷 Shapes' },
                  { key: 'household', label: '🧺 Household' },
                  { key: 'numbers', label: '🔢 Numbers' }
                ] as const
              ).map(c => (
                <div
                  key={c.key}
                  className={`cat-chip ${selectedCat === c.key ? 'active' : ''}`}
                  onClick={() => setSelectedCat(c.key)}
                >
                  {c.label} (Lvl {levels[c.key]})
                </div>
              ))}
            </div>

            {/* Grid with dynamic columns and card size */}
            <div
              className="match-grid-container"
              style={{ gridTemplateColumns: getGridColumns() }}
            >
              {deck.map((card, idx) => {
                const isFlipped = flipped.includes(idx) || matched.includes(idx);
                return (
                  <div
                    key={card.uid}
                    className={`mtile ${isFlipped ? 'flipped' : ''} ${matched.includes(idx) ? 'matched' : ''}`}
                    onClick={() => handleCardClick(idx)}
                  >
                    {isFlipped ? (
                      <img src={card.item.image} alt={card.item.name} className="mtile-img" />
                    ) : (
                      <span className="mtile-front">?</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="callout">
              {isWon && `🎉 Superb! Level ${currentLevel + 1} unlocked!`}
              {!isWon && `Level ${currentLevel}: Find all matching pairs. Starts with large cards and expands as you level up!`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}