import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AnalyticsTab = 'playtime' | 'medicine' | 'yoga';

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

interface DayReminderLog {
  taken: number;
  total: number;
  waterGlasses: number;
  items: { title: string; time: string; type: string }[];
}

export default function PatientAnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('playtime');

  // 1. Playtime Real-time State
  const [weeklyData, setWeeklyData] = useState<DailyRecord[]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyRecord | null>(null);
  const [gameLevels, setGameLevels] = useState({
    identify: 1,
    memory: 1,
    jigsaw: 1,
    button: 1
  });

  // 2. Reminders / Medicine Real-time State
  const [reminderData, setReminderData] = useState<{
    adherenceRate: number;
    takenCount: number;
    totalScheduled: number;
    waterGlassesToday: number;
    weeklyGrid: { day: string; date: string; taken: number; total: number; status: 'full' | 'partial' | 'missed' | 'none' }[];
  }>({
    adherenceRate: 0,
    takenCount: 0,
    totalScheduled: 0,
    waterGlassesToday: 0,
    weeklyGrid: []
  });

  // 3. Yoga Real-time State
  const [yogaData, setYogaData] = useState<{
    totalMinutes: number;
    sessionsCompleted: number;
    streakDays: number;
    weeklyBars: { day: string; mins: number }[];
  }>({
    totalMinutes: 0,
    sessionsCompleted: 0,
    streakDays: 0,
    weeklyBars: []
  });

  useEffect(() => {
    const daysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // --- A. LOAD REAL PLAYTIME GAMES DATA ---
    const rawGames = localStorage.getItem('sahayak_game_analytics');
    const storedGames: Record<string, Record<string, { minutes: number; icon: string; color: string }>> = rawGames ? JSON.parse(rawGames) : {};
    const past7DaysGames: DailyRecord[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = daysList[d.getDay()];
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

      const dayGamesObj = storedGames[key] || {};
      const games: GameBreakdown[] = Object.keys(dayGamesObj).map((gName) => ({
        name: gName,
        minutes: dayGamesObj[gName].minutes,
        icon: dayGamesObj[gName].icon,
        color: dayGamesObj[gName].color
      }));

      const totalMinutes = games.reduce((acc, curr) => acc + curr.minutes, 0);

      past7DaysGames.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        totalMinutes,
        games
      });
    }
    setWeeklyData(past7DaysGames);

    // --- B. LOAD 4 GAMES LEVELS ---
    setGameLevels({
      identify: Math.max(
        parseInt(localStorage.getItem('sahayak_level_random') || '1', 10),
        parseInt(localStorage.getItem('sahayak_level_family') || '1', 10),
        parseInt(localStorage.getItem('sahayak_level_surroundings') || '1', 10)
      ),
      memory: Math.max(
        parseInt(localStorage.getItem('sahayak_mem_lvl_fruits') || '1', 10),
        parseInt(localStorage.getItem('sahayak_mem_lvl_shapes') || '1', 10),
        parseInt(localStorage.getItem('sahayak_mem_lvl_household') || '1', 10),
        parseInt(localStorage.getItem('sahayak_mem_lvl_numbers') || '1', 10)
      ),
      jigsaw: parseInt(localStorage.getItem('sahayak_jigsaw_level') || '1', 10),
      button: parseInt(localStorage.getItem('sahayak_button_level') || '1', 10)
    });

    // --- C. LOAD REAL REMINDER & MEDICINE LOGS ---
    const rawRemLogs = localStorage.getItem('sahayak_reminder_logs');
    const storedRemLogs: Record<string, DayReminderLog> = rawRemLogs ? JSON.parse(rawRemLogs) : {};
    
    // Total scheduled reminders count from reminders list
    const rawRemList = localStorage.getItem('sahayak_reminders_list');
    const remList = rawRemList ? JSON.parse(rawRemList) : [];
    const enabledRemCount = remList.filter((r: any) => r.enabled).length || 1;

    let totalTakenPast7 = 0;
    let totalScheduledPast7 = 0;
    const weeklyRemGrid = [];
    const todayKey = new Date().toISOString().split('T')[0];
    const todayWater = storedRemLogs[todayKey]?.waterGlasses || 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = daysList[d.getDay()];
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

      const dayLog = storedRemLogs[key];
      const taken = dayLog ? dayLog.taken : 0;
      const total = enabledRemCount;

      totalTakenPast7 += taken;
      totalScheduledPast7 += total;

      let status: 'full' | 'partial' | 'missed' | 'none' = 'none';
      if (taken > 0 && taken >= total) status = 'full';
      else if (taken > 0) status = 'partial';
      else if (i !== 0) status = 'missed'; // past day with 0 taken

      weeklyRemGrid.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        taken,
        total,
        status
      });
    }

    const calculatedAdherence = totalScheduledPast7 > 0 ? Math.round((totalTakenPast7 / totalScheduledPast7) * 100) : 0;

    setReminderData({
      adherenceRate: Math.min(100, calculatedAdherence),
      takenCount: totalTakenPast7,
      totalScheduled: totalScheduledPast7,
      waterGlassesToday: todayWater,
      weeklyGrid: weeklyRemGrid
    });

    // --- D. LOAD REAL YOGA & WELLNESS LOGS ---
    const rawYoga = localStorage.getItem('sahayak_yoga_analytics');
    const storedYoga: Record<string, { minutes: number; sessions: number }> = rawYoga ? JSON.parse(rawYoga) : {};

    let totalYogaMins = 0;
    let totalSessions = 0;
    let streak = 0;
    const weeklyYogaBars = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = daysList[d.getDay()];

      const dayYoga = storedYoga[key] || { minutes: 0, sessions: 0 };
      totalYogaMins += dayYoga.minutes;
      totalSessions += dayYoga.sessions;

      if (dayYoga.minutes > 0) streak += 1;
      else if (i !== 0) streak = 0;

      weeklyYogaBars.push({
        day: i === 0 ? 'Today' : dayName,
        mins: dayYoga.minutes
      });
    }

    setYogaData({
      totalMinutes: totalYogaMins,
      sessionsCompleted: totalSessions,
      streakDays: streak,
      weeklyBars: weeklyYogaBars
    });

  }, []);

  const totalWeeklyMinutes = weeklyData.reduce((acc, curr) => acc + curr.totalMinutes, 0);
  const totalHours = (totalWeeklyMinutes / 60).toFixed(1);
  const maxMinutes = Math.max(...weeklyData.map(d => d.totalMinutes), 10);
  const maxYogaMins = Math.max(...yogaData.weeklyBars.map(b => b.mins), 15);

  return (
    <div className="analytics-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --blue: #3E7FB8; --blue-tint: #E1EDF6; --purple: #6B4E9B; --purple-tint: #EFE9F6;
          --red: #B33F33; --red-tint: #FBE8E6;
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
        .notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 120px; height: 24px; background: #111614; border-radius: 20px; z-index: 10; }
        .page-header {
          padding: 44px 18px 10px 18px; background: var(--white); box-shadow: var(--shadow);
          display: flex; flex-direction: column; gap: 12px; z-index: 2;
        }
        .header-top { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }

        .tab-button-group {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding-bottom: 4px;
        }
        .tab-btn {
          padding: 10px 6px; border-radius: 14px; font-weight: 800; font-size: 12px;
          border: 1.5px solid transparent; background: var(--canvas); color: var(--ink-soft);
          cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px;
          font-family: inherit; transition: all 0.2s ease;
        }
        .tab-btn.active {
          background: var(--green); color: #fff; border-color: var(--green);
          box-shadow: 0 4px 12px rgba(63,107,79,0.25);
        }
        .tab-btn.med-active {
          background: var(--blue); color: #fff; border-color: var(--blue);
          box-shadow: 0 4px 12px rgba(62,127,184,0.25);
        }
        .tab-btn.yoga-active {
          background: var(--purple); color: #fff; border-color: var(--purple);
          box-shadow: 0 4px 12px rgba(107,78,155,0.25);
        }

        .content { flex: 1; overflow-y: auto; padding: 16px 18px 26px 18px; }

        .summary-card {
          border-radius: 20px; padding: 18px 20px; color: #fff; margin-bottom: 18px;
        }
        .summary-card .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; opacity: 0.9; }
        .summary-card .val { font-size: 26px; font-weight: 900; margin-top: 4px; font-family: 'Fraunces', serif; }
        .summary-card .sub { font-size: 12px; font-weight: 700; opacity: 0.95; margin-top: 2px; }

        .levels-card, .chart-card, .metric-card {
          background: var(--white); border-radius: 22px; padding: 18px 16px;
          box-shadow: var(--shadow); margin-bottom: 16px;
        }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .chart-header h3 { margin: 0; font-size: 14.5px; font-weight: 800; color: var(--ink); }

        .bars-container {
          display: flex; justify-content: space-between; align-items: flex-end;
          height: 150px; padding-top: 16px; border-bottom: 1.5px solid var(--green-tint);
        }
        .bar-col { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; cursor: pointer; }
        .bar-wrapper { width: 22px; height: 110px; display: flex; align-items: flex-end; background: #EEF2EB; border-radius: 8px; overflow: hidden; }
        .bar-fill { width: 100%; border-radius: 8px; background: var(--green); transition: height 0.4s ease; }
        .bar-col.active .bar-fill { background: var(--marigold); }
        .bar-label { font-size: 10.5px; font-weight: 800; color: var(--ink-soft); }

        .level-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .level-row:last-child { margin-bottom: 0; }
        .level-icon { width: 34px; height: 34px; border-radius: 10px; background: var(--green-tint); display: flex; align-items: center; justify-content: center; font-size: 17px; }
        .level-info { flex: 1; }
        .level-info-top { display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 800; color: var(--ink); margin-bottom: 4px; }
        .level-progress-bg { width: 100%; height: 6px; background: #EEF2EB; border-radius: 10px; overflow: hidden; }
        .level-progress-bar { height: 100%; border-radius: 10px; background: var(--green); }

        /* Dynamic Ring */
        .ring-container {
          display: flex; align-items: center; justify-content: space-around; padding: 10px 0;
        }
        .ring-circle {
          width: 92px; height: 92px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; position: relative;
        }
        .ring-inner {
          width: 70px; height: 70px; border-radius: 50%; background: var(--white);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .ring-inner span.num { font-size: 19px; font-weight: 900; color: var(--blue); line-height: 1; }
        .ring-inner span.lbl { font-size: 9px; font-weight: 800; color: var(--ink-soft); text-transform: uppercase; }

        .week-dots-grid { display: flex; justify-content: space-between; margin-top: 14px; }
        .dot-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .dot-badge {
          width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 900;
        }
        .dot-badge.full { background: var(--blue); color: #fff; }
        .dot-badge.partial { background: var(--blue-tint); color: var(--blue); }
        .dot-badge.missed { background: var(--red-tint); color: var(--red); }
        .dot-badge.none { background: #EEF2EB; color: #9EAEA3; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.45);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .detail-sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 32px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
        }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .sheet-header h3 { margin: 0; font-family: 'Fraunces', serif; font-size: 18px; color: var(--ink); }
        .close-btn { background: var(--green-tint); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; font-weight: bold; cursor: pointer; color: var(--green); }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <div className="header-top">
              <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <h1>Analytics &amp; Reports</h1>
            </div>

            <div className="tab-button-group">
              <button
                className={`tab-btn ${activeTab === 'playtime' ? 'active' : ''}`}
                onClick={() => setActiveTab('playtime')}
              >
                <span>🎮</span> Playtime
              </button>
              <button
                className={`tab-btn ${activeTab === 'medicine' ? 'med-active' : ''}`}
                onClick={() => setActiveTab('medicine')}
              >
                <span>💊</span> Reminders
              </button>
              <button
                className={`tab-btn ${activeTab === 'yoga' ? 'yoga-active' : ''}`}
                onClick={() => setActiveTab('yoga')}
              >
                <span>🧘</span> Yoga &amp; Rest
              </button>
            </div>
          </div>

          <div className="content">
            {/* ================= TAB 1: PLAYTIME ================= */}
            {activeTab === 'playtime' && (
              <div>
                <div className="summary-card" style={{ background: 'linear-gradient(135deg, #3F6B4F 0%, #2E5140 100%)' }}>
                  <div className="label">Total Playtime This Week</div>
                  <div className="val">{totalHours} Hours</div>
                  <div className="sub">{totalWeeklyMinutes} minutes of cognitive exercise</div>
                </div>

                <div className="levels-card">
                  <div className="chart-header">
                    <h3>⭐ Levels Achieved</h3>
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 800 }}>Live Progress</span>
                  </div>

                  <div className="level-row">
                    <div className="level-icon">🖼️</div>
                    <div className="level-info">
                      <div className="level-info-top"><span>Identify Picture</span><span>Lvl {gameLevels.identify}/100</span></div>
                      <div className="level-progress-bg"><div className="level-progress-bar" style={{ width: `${gameLevels.identify}%` }} /></div>
                    </div>
                  </div>

                  <div className="level-row">
                    <div className="level-icon">🃏</div>
                    <div className="level-info">
                      <div className="level-info-top"><span>Memory Match</span><span>Lvl {gameLevels.memory}/100</span></div>
                      <div className="level-progress-bg"><div className="level-progress-bar" style={{ width: `${gameLevels.memory}%` }} /></div>
                    </div>
                  </div>

                  <div className="level-row">
                    <div className="level-icon">🧩</div>
                    <div className="level-info">
                      <div className="level-info-top"><span>Jigsaw Puzzle</span><span>Lvl {gameLevels.jigsaw}/100</span></div>
                      <div className="level-progress-bg"><div className="level-progress-bar" style={{ width: `${gameLevels.jigsaw}%` }} /></div>
                    </div>
                  </div>

                  <div className="level-row">
                    <div className="level-icon">🔘</div>
                    <div className="level-info">
                      <div className="level-info-top"><span>Button Sorting</span><span>Lvl {gameLevels.button}/100</span></div>
                      <div className="level-progress-bg"><div className="level-progress-bar" style={{ width: `${gameLevels.button}%` }} /></div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Daily Activity Graph</h3>
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 800 }}>Tap bar to inspect</span>
                  </div>

                  <div className="bars-container">
                    {weeklyData.map((d, idx) => {
                      const heightPercent = d.totalMinutes > 0 ? (d.totalMinutes / maxMinutes) * 100 : 4;
                      const isSelected = selectedDay?.day === d.day;
                      return (
                        <div key={idx} className={`bar-col ${isSelected ? 'active' : ''}`} onClick={() => setSelectedDay(d)}>
                          <div className="bar-wrapper">
                            <div className="bar-fill" style={{ height: `${heightPercent}%`, background: d.totalMinutes === 0 ? '#DCE3D6' : undefined }} />
                          </div>
                          <span className="bar-label">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: MEDICINE & REMINDERS (100% REAL) ================= */}
            {activeTab === 'medicine' && (
              <div>
                <div className="summary-card" style={{ background: 'linear-gradient(135deg, #3E7FB8 0%, #275782 100%)' }}>
                  <div className="label">Live Adherence Rate</div>
                  <div className="val">{reminderData.adherenceRate}% Tracked</div>
                  <div className="sub">{reminderData.takenCount} of {reminderData.totalScheduled} completed tasks this week</div>
                </div>

                {/* 100% Real Donut Dynamic Ring */}
                <div className="metric-card">
                  <div className="chart-header">
                    <h3>Dose Adherence Ring</h3>
                    <span style={{ color: 'var(--blue)', fontWeight: 800, fontSize: '11px' }}>
                      {reminderData.adherenceRate >= 80 ? 'Optimal' : reminderData.adherenceRate > 0 ? 'Active' : 'No logs yet'}
                    </span>
                  </div>

                  <div className="ring-container">
                    <div
                      className="ring-circle"
                      style={{
                        background: reminderData.adherenceRate > 0
                          ? `conic-gradient(var(--blue) 0% ${reminderData.adherenceRate}%, #D7E5F0 ${reminderData.adherenceRate}% 100%)`
                          : '#EEF2EB'
                      }}
                    >
                      <div className="ring-inner">
                        <span className="num">{reminderData.adherenceRate}%</span>
                        <span className="lbl">Taken</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--blue)' }} />
                        <span>Completed Tasks ({reminderData.takenCount})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--ink-soft)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: '#D7E5F0' }} />
                        <span>Scheduled Total ({reminderData.totalScheduled})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Live History Grid */}
                <div className="metric-card">
                  <div className="chart-header">
                    <h3>7-Day Schedule History</h3>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 700 }}>Past 7 Days</span>
                  </div>

                  <div className="week-dots-grid">
                    {reminderData.weeklyGrid.map((item, i) => (
                      <div key={i} className="dot-col">
                        <div className={`dot-badge ${item.status}`}>
                          {item.status === 'full' ? '✓' : item.status === 'partial' ? '•' : item.status === 'missed' ? '✕' : '—'}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ink-soft)' }}>{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Intake Log */}
                <div className="metric-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: 'var(--blue-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💧</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--ink)' }}>Water Intake Today</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 700 }}>Logged from alarm acknowledges</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--blue)' }}>{reminderData.waterGlassesToday} Glasses</span>
                </div>
              </div>
            )}

            {/* ================= TAB 3: YOGA & WELLNESS (100% REAL) ================= */}
            {activeTab === 'yoga' && (
              <div>
                <div className="summary-card" style={{ background: 'linear-gradient(135deg, #6B4E9B 0%, #4D3375 100%)' }}>
                  <div className="label">Weekly Mind &amp; Body Exercise</div>
                  <div className="val">{yogaData.totalMinutes} Mins</div>
                  <div className="sub">{yogaData.sessionsCompleted} Gentle Sessions Completed</div>
                </div>

                <div className="metric-card">
                  <div className="chart-header">
                    <h3>Daily Yoga &amp; Breathing Time</h3>
                    <span style={{ color: 'var(--purple)', fontWeight: 800, fontSize: '11px' }}>
                      🔥 {yogaData.streakDays} Day Streak
                    </span>
                  </div>

                  <div className="bars-container">
                    {yogaData.weeklyBars.map((item, idx) => {
                      const h = item.mins > 0 ? (item.mins / maxYogaMins) * 100 : 4;
                      return (
                        <div key={idx} className="bar-col">
                          <div className="bar-wrapper">
                            <div className="bar-fill" style={{ height: `${h}%`, background: item.mins > 0 ? 'var(--purple)' : '#EEF2EB' }} />
                          </div>
                          <span className="bar-label">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="metric-card">
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: 'var(--ink)' }}>Calmness Routine</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
                    <span style={{ color: 'var(--ink-soft)' }}>Sessions this week</span>
                    <span style={{ color: 'var(--purple)' }}>{yogaData.sessionsCompleted} sessions</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                    <span style={{ color: 'var(--ink-soft)' }}>Total practice time</span>
                    <span style={{ color: 'var(--purple)' }}>{yogaData.totalMinutes} minutes</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drill Down Modal for Playtime Bar Clicks */}
          {selectedDay && (
            <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
              <div className="detail-sheet" onClick={e => e.stopPropagation()}>
                <div className="sheet-header">
                  <div>
                    <h3>{selectedDay.day} Breakdown ({selectedDay.date})</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 700 }}>
                      Total played: <b>{selectedDay.totalMinutes} mins</b>
                    </p>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedDay(null)}>✕</button>
                </div>

                {selectedDay.games.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '20px 0', fontWeight: 700 }}>
                    No games were played on this day.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedDay.games.map((g, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--canvas)', padding: '10px 12px', borderRadius: '14px' }}>
                        <div style={{ fontSize: '20px' }}>{g.icon}</div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>{g.name}</h4>
                        </div>
                        <span style={{ fontWeight: 900, color: 'var(--green-dark)' }}>{g.minutes}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}