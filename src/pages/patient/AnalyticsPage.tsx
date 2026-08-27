import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameBreakdown {
  name: string;
  minutes: number;
  icon: string;
  color: string;
}

interface DailyRecord {
  day: string;
  date: string;
  totalMinutes: number;
  games: GameBreakdown[];
}

export default function PatientAnalyticsPage() {
  const navigate = useNavigate();

  const weeklyData: DailyRecord[] = [
    {
      day: 'Mon',
      date: '21 Aug',
      totalMinutes: 45,
      games: [
        { name: 'Memory Match', minutes: 20, icon: '🃏', color: '#3F6B4F' },
        { name: 'Jigsaw Puzzle', minutes: 15, icon: '🧩', color: '#D98A2B' },
        { name: 'Button Sorting', minutes: 10, icon: '🔘', color: '#3E7FB8' }
      ]
    },
    {
      day: 'Tue',
      date: '22 Aug',
      totalMinutes: 60,
      games: [
        { name: 'Identify Picture', minutes: 25, icon: '🖼️', color: '#8A5A1C' },
        { name: 'Memory Match', minutes: 20, icon: '🃏', color: '#3F6B4F' },
        { name: 'Jigsaw Puzzle', minutes: 15, icon: '🧩', color: '#D98A2B' }
      ]
    },
    {
      day: 'Wed',
      date: '23 Aug',
      totalMinutes: 30,
      games: [
        { name: 'Button Sorting', minutes: 15, icon: '🔘', color: '#3E7FB8' },
        { name: 'Identify Picture', minutes: 15, icon: '🖼️', color: '#8A5A1C' }
      ]
    },
    {
      day: 'Thu',
      date: '24 Aug',
      totalMinutes: 75,
      games: [
        { name: 'Memory Match', minutes: 30, icon: '🃏', color: '#3F6B4F' },
        { name: 'Jigsaw Puzzle', minutes: 25, icon: '🧩', color: '#D98A2B' },
        { name: 'Button Sorting', minutes: 20, icon: '🔘', color: '#3E7FB8' }
      ]
    },
    {
      day: 'Fri',
      date: '25 Aug',
      totalMinutes: 50,
      games: [
        { name: 'Identify Picture', minutes: 20, icon: '🖼️', color: '#8A5A1C' },
        { name: 'Memory Match', minutes: 30, icon: '🃏', color: '#3F6B4F' }
      ]
    },
    {
      day: 'Sat',
      date: '26 Aug',
      totalMinutes: 90,
      games: [
        { name: 'Memory Match', minutes: 35, icon: '🃏', color: '#3F6B4F' },
        { name: 'Jigsaw Puzzle', minutes: 30, icon: '🧩', color: '#D98A2B' },
        { name: 'Identify Picture', minutes: 15, icon: '🖼️', color: '#8A5A1C' },
        { name: 'Button Sorting', minutes: 10, icon: '🔘', color: '#3E7FB8' }
      ]
    },
    {
      day: 'Sun',
      date: 'Today',
      totalMinutes: 40,
      games: [
        { name: 'Memory Match', minutes: 25, icon: '🃏', color: '#3F6B4F' },
        { name: 'Button Sorting', minutes: 15, icon: '🔘', color: '#3E7FB8' }
      ]
    }
  ];

  const [selectedDay, setSelectedDay] = useState<DailyRecord | null>(null);

  const totalWeeklyMinutes = weeklyData.reduce((acc, curr) => acc + curr.totalMinutes, 0);
  const totalHours = (totalWeeklyMinutes / 60).toFixed(1);
  const maxMinutes = Math.max(...weeklyData.map(d => d.totalMinutes));

  return (
    <div className="analytics-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --blue: #3E7FB8; --blue-tint: #E1EDF6;
        }
        .analytics-root-container {
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

        /* Summary Metric Card */
        .summary-card {
          background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
          border-radius: 20px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 22px rgba(63,107,79,0.35);
          margin-bottom: 20px;
        }
        .summary-card .label { font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #CFE3D6; }
        .summary-card .val { font-size: 28px; font-weight: 900; margin-top: 4px; font-family: 'Fraunces', serif; }
        .summary-card .sub { font-size: 12px; font-weight: 700; color: #E3EDE5; margin-top: 2px; }

        /* Graph Chart Container */
        .chart-card {
          background: var(--white); border-radius: 22px; padding: 20px 16px;
          box-shadow: var(--shadow); margin-bottom: 18px;
        }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .chart-header h3 { margin: 0; font-size: 15px; font-weight: 800; color: var(--ink); }
        .chart-header span { font-size: 11px; font-weight: 800; color: var(--green); background: var(--green-tint); padding: 4px 8px; border-radius: 10px; }

        .bars-container {
          display: flex; justify-content: space-between; align-items: flex-end;
          height: 160px; padding-top: 20px; border-bottom: 1.5px solid var(--green-tint);
        }
        .bar-col {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          flex: 1; cursor: pointer; transition: transform 0.15s ease;
        }
        .bar-col:hover { transform: scale(1.05); }
        .bar-wrapper {
          width: 24px; height: 120px; display: flex; align-items: flex-end;
          background: #EEF2EB; border-radius: 8px; overflow: hidden;
        }
        .bar-fill {
          width: 100%; border-radius: 8px; background: var(--green);
          transition: height 0.4s ease, background 0.2s ease;
        }
        .bar-col.active .bar-fill { background: var(--marigold); }
        .bar-label { font-size: 12px; font-weight: 800; color: var(--ink-soft); }
        .bar-col.active .bar-label { color: var(--marigold); font-weight: 900; }

        .hint-text { text-align: center; font-size: 11.5px; font-weight: 700; color: var(--ink-soft); margin-top: 10px; }

        /* Modal / Detail View */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.45);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .detail-sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 32px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .sheet-header h3 { margin: 0; font-family: 'Fraunces', serif; font-size: 19px; color: var(--ink); }
        .close-btn { background: var(--green-tint); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; font-weight: bold; cursor: pointer; color: var(--green); }

        .game-breakdown-list { display: flex; flex-direction: column; gap: 12px; }
        .game-row {
          display: flex; align-items: center; gap: 14px; background: var(--canvas);
          padding: 12px 14px; border-radius: 16px;
        }
        .game-icon {
          width: 42px; height: 42px; border-radius: 12px; background: var(--white);
          display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: var(--shadow);
        }
        .game-info { flex: 1; }
        .game-info h4 { margin: 0 0 4px; font-size: 14px; font-weight: 800; color: var(--ink); }
        .game-progress-bar { width: 100%; height: 6px; background: #DCE3D6; border-radius: 6px; overflow: hidden; }
        .game-progress-fill { height: 100%; border-radius: 6px; }
        .game-time { font-size: 13.5px; font-weight: 900; color: var(--green-dark); }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <h1>Playtime Analytics</h1>
          </div>

          <div className="content">
            {/* Total Playtime Summary */}
            <div className="summary-card">
              <div className="label">Total Playtime This Week</div>
              <div className="val">{totalHours} Hours</div>
              <div className="sub">{totalWeeklyMinutes} minutes of cognitive exercise</div>
            </div>

            {/* Interactive Graph Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Daily Activity</h3>
                <span>Tap any bar to inspect</span>
              </div>

              <div className="bars-container">
                {weeklyData.map((d, idx) => {
                  const heightPercent = (d.totalMinutes / maxMinutes) * 100;
                  const isSelected = selectedDay?.day === d.day;
                  return (
                    <div
                      key={idx}
                      className={`bar-col ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedDay(d)}
                    >
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="bar-label">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="hint-text">
                💡 Click on any day to see separate time spent on each game.
              </div>
            </div>

            {/* Quick Insights List */}
            <div style={{ background: 'var(--white)', borderRadius: '20px', padding: '16px', boxShadow: 'var(--shadow)' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink)' }}>Weekly Highlights</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '8px' }}>
                <span>Most Played Game</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>🃏 Memory Match</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                <span>Daily Average</span>
                <span style={{ color: 'var(--green)', fontWeight: 800 }}>{Math.round(totalWeeklyMinutes / 7)} mins/day</span>
              </div>
            </div>
          </div>

          {/* Drill-down Detail Modal */}
          {selectedDay && (
            <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
              <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="sheet-header">
                  <div>
                    <h3>{selectedDay.day} Breakdown ({selectedDay.date})</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 700 }}>
                      Total played: <b>{selectedDay.totalMinutes} mins</b>
                    </p>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedDay(null)}>✕</button>
                </div>

                <div className="game-breakdown-list">
                  {selectedDay.games.map((g, i) => {
                    const percent = Math.round((g.minutes / selectedDay.totalMinutes) * 100);
                    return (
                      <div key={i} className="game-row">
                        <div className="game-icon">{g.icon}</div>
                        <div className="game-info">
                          <h4>{g.name}</h4>
                          <div className="game-progress-bar">
                            <div
                              className="game-progress-fill"
                              style={{ width: `${percent}%`, background: g.color }}
                            />
                          </div>
                        </div>
                        <div className="game-time">{g.minutes}m</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}