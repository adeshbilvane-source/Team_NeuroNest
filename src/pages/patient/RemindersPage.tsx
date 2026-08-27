import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReminderItem {
  id: string;
  title: string;
  time?: string;
  displayTime?: string;
  period?: 'AM' | 'PM';
  repeat?: string;
  type: 'daily' | 'medicine' | 'water';
  enabled: boolean;
  voiceMessage: string;
  dosage?: string;
}

interface SnoozedAlarm {
  item: ReminderItem;
  triggerTimestamp: number;
}

export default function RemindersPage() {
  const navigate = useNavigate();

  const [waterInterval, setWaterInterval] = useState<number>(() => {
    return parseFloat(localStorage.getItem('sahayak_water_interval') || '1.5');
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const raw = localStorage.getItem('sahayak_reminders_list');
    if (raw) return JSON.parse(raw);
    return [
      {
        id: 'rem-1',
        title: 'Have breakfast',
        time: '07:30',
        displayTime: '7:30',
        period: 'AM',
        repeat: 'Repeats every day',
        type: 'daily',
        enabled: true,
        voiceMessage: 'Attention please! Your breakfast time is now. Please pause your activity and have your breakfast.'
      },
      {
        id: 'rem-2',
        title: 'Wind down for bed',
        time: '21:00',
        displayTime: '9:00',
        period: 'PM',
        repeat: 'Repeats every day',
        type: 'daily',
        enabled: true,
        voiceMessage: 'Attention please! It is time to wind down for bed. Please pause your activity and get ready to sleep.'
      },
      {
        id: 'rem-3',
        title: 'Blood pressure tablet',
        time: '08:00',
        displayTime: '8:00',
        period: 'AM',
        repeat: '1 tablet, after breakfast',
        type: 'medicine',
        enabled: true,
        dosage: '1 tablet',
        voiceMessage: 'Attention please! It is time to take your medicine: Blood pressure tablet. Please pause your activity and take your medication now.'
      }
    ];
  });

  const [activeAlarm, setActiveAlarm] = useState<ReminderItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('08:00');
  const [newType, setNewType] = useState<'daily' | 'medicine'>('daily');
  const [newDosage, setNewDosage] = useState<string>('1 tablet');

  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const alarmIntervalRef = useRef<any>(null);
  const waterTimerRef = useRef<any>(null);
  const triggeredMinuteRef = useRef<string>('');

  useEffect(() => {
    localStorage.setItem('sahayak_reminders_list', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('sahayak_water_interval', waterInterval.toString());
  }, [waterInterval]);

  // Voice Announcement Loop
  const playVoiceAlarm = (msg: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      speechSynthRef.current = utterance;

      window.speechSynthesis.speak(utterance);

      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = setInterval(() => {
        window.speechSynthesis.speak(utterance);
      }, 6500);
    }
  };

  const triggerAlarm = (item: ReminderItem) => {
    setActiveAlarm({ ...item });
    playVoiceAlarm(item.voiceMessage);
  };

  const markReminderCompletedInAnalytics = (rem: ReminderItem) => {
    const raw = localStorage.getItem('sahayak_reminder_logs');
    const logs = raw ? JSON.parse(raw) : {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (!logs[todayKey]) logs[todayKey] = { taken: 0, total: 0, waterGlasses: 0, items: [] };

    if (rem.type === 'water') {
      logs[todayKey].waterGlasses = (logs[todayKey].waterGlasses || 0) + 1;
    } else {
      logs[todayKey].taken += 1;
      logs[todayKey].items.push({
        title: rem.title,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: rem.type
      });
    }

    localStorage.setItem('sahayak_reminder_logs', JSON.stringify(logs));
  };

  const stopVoiceAlarm = () => {
    if (activeAlarm) {
      markReminderCompletedInAnalytics(activeAlarm);
    }
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveAlarm(null);
  };

  // Reliable Snooze / Shuffle Handler
  const handleSnooze = (minutesOrSeconds: number, isSeconds = false) => {
    if (!activeAlarm) return;
    const currentItem = { ...activeAlarm };

    // Stop current voice
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setActiveAlarm(null);

    const msToAdd = isSeconds ? minutesOrSeconds * 1000 : minutesOrSeconds * 60 * 1000;
    const triggerAt = Date.now() + msToAdd;

    const rawSnoozed = localStorage.getItem('sahayak_snoozed_queue');
    const queue: SnoozedAlarm[] = rawSnoozed ? JSON.parse(rawSnoozed) : [];
    queue.push({ item: currentItem, triggerTimestamp: triggerAt });
    localStorage.setItem('sahayak_snoozed_queue', JSON.stringify(queue));

    alert(`Alarm snoozed! Will ring and lock screen in ${isSeconds ? minutesOrSeconds + ' seconds' : minutesOrSeconds + ' minutes'}.`);
  };

  // Central Clock Engine (Checks Scheduled + Snoozed Alarms every second)
  useEffect(() => {
    const checkClock = () => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const nowMs = Date.now();

      // 1. Check Snoozed Queue
      const rawSnoozed = localStorage.getItem('sahayak_snoozed_queue');
      if (rawSnoozed) {
        let queue: SnoozedAlarm[] = JSON.parse(rawSnoozed);
        const dueIndex = queue.findIndex(q => nowMs >= q.triggerTimestamp);

        if (dueIndex !== -1 && !activeAlarm) {
          const dueAlarm = queue[dueIndex];
          queue.splice(dueIndex, 1);
          localStorage.setItem('sahayak_snoozed_queue', JSON.stringify(queue));

          // Force full UI modal popup & sound
          triggerAlarm(dueAlarm.item);
          return;
        }
      }

      // 2. Check Standard Daily Reminders
      if (triggeredMinuteRef.current === currentTimeStr) return;

      reminders.forEach((item) => {
        if (item.enabled && item.time === currentTimeStr && !activeAlarm) {
          triggeredMinuteRef.current = currentTimeStr;
          triggerAlarm(item);
        }
      });
    };

    const timer = setInterval(checkClock, 1000);
    return () => clearInterval(timer);
  }, [reminders, activeAlarm]);

  // Water Reminder Timer Loop
  useEffect(() => {
    if (waterTimerRef.current) clearInterval(waterTimerRef.current);

    const ms = waterInterval * 60 * 60 * 1000;
    waterTimerRef.current = setInterval(() => {
      triggerAlarm({
        id: 'water-live-' + Date.now(),
        title: 'Drink Water',
        displayTime: 'Now',
        period: 'AM',
        type: 'water',
        enabled: true,
        voiceMessage: 'Attention please! It is time to drink a glass of fresh water. Please pause your activity and stay hydrated.'
      });
    }, ms);

    return () => {
      if (waterTimerRef.current) clearInterval(waterTimerRef.current);
    };
  }, [waterInterval]);

  const handleToggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTime) return;

    const [hoursStr, minutesStr] = newTime.split(':');
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayTime = `${displayHours}:${minutesStr}`;

    const voiceMessage =
      newType === 'medicine'
        ? `Attention please! It is time to take your medicine: ${newTitle}. Please pause your activity and take your medication now.`
        : `Attention please! Your scheduled time for ${newTitle} is now. Please pause your activity and complete your task.`;

    const newItem: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: newTitle.trim(),
      time: newTime,
      displayTime,
      period,
      repeat: newType === 'medicine' ? `${newDosage}, daily` : 'Repeats every day',
      type: newType,
      enabled: true,
      dosage: newType === 'medicine' ? newDosage : undefined,
      voiceMessage
    };

    setReminders(prev => [...prev, newItem]);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="rem-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --red-tint: #FBE8E6; --blue: #3E7FB8; --blue-dark: #275782;
        }
        .rem-root-container {
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
          display: flex; align-items: center; gap: 12px; z-index: 2;
        }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }

        .section-label {
          font-size: 11.5px; font-weight: 900; color: var(--ink-soft);
          text-transform: uppercase; letter-spacing: 0.6px; margin: 16px 0 10px;
        }

        .water-card {
          background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
          border-radius: 22px; padding: 18px 20px; color: #fff; box-shadow: 0 10px 22px rgba(62,127,184,0.35);
        }
        .water-card-top { display: flex; justify-content: space-between; align-items: center; }
        .water-card .label { font-size: 11px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; color: #D5E8F8; }
        .water-test-btn {
          background: rgba(255,255,255,0.25); border: none; border-radius: 10px;
          color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; cursor: pointer;
        }
        .water-card .title { font-size: 15px; font-weight: 900; margin: 6px 0 14px; line-height: 1.3; }
        .water-controls { display: flex; align-items: center; justify-content: center; gap: 16px; }
        .step-btn {
          width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.22);
          border: none; color: #fff; font-size: 20px; font-weight: 900; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .interval-text { font-size: 15px; font-weight: 900; }

        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 11px 14px; font-size: 11.5px; color: #7a5015; font-weight: 700; line-height: 1.4; margin: 12px 0 6px;
        }

        .rem-card {
          background: var(--white); border-radius: 18px; padding: 14px 16px;
          box-shadow: var(--shadow); margin-bottom: 10px; display: flex;
          align-items: center; justify-content: space-between; gap: 10px;
        }
        .rem-time-box { min-width: 52px; text-align: left; }
        .rem-time-box .t { font-size: 16px; font-weight: 900; color: var(--ink); line-height: 1; }
        .rem-time-box .p { font-size: 11px; font-weight: 800; color: var(--green); margin-top: 2px; }
        .rem-info { flex: 1; margin-left: 4px; }
        .rem-info h4 { margin: 0; font-size: 14px; font-weight: 800; color: var(--ink); }
        .rem-info p { margin: 2px 0 0; font-size: 11px; font-weight: 700; color: var(--ink-soft); }

        .rem-actions { display: flex; align-items: center; gap: 10px; }
        .test-bell-btn {
          background: var(--green-tint); border: none; border-radius: 10px; padding: 6px 8px;
          font-size: 12px; font-weight: 800; color: var(--green-dark); cursor: pointer;
        }

        .switch { position: relative; display: inline-block; width: 44px; height: 26px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background-color: #D3DDD6; transition: .3s; border-radius: 26px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--green); }
        input:checked + .slider:before { transform: translateX(18px); }

        .add-rem-btn {
          width: 100%; border: 2px dashed #B8C7BA; background: var(--white);
          border-radius: 18px; padding: 14px; color: var(--green); font-weight: 900;
          font-size: 13.5px; cursor: pointer; margin-top: 6px; box-sizing: border-box;
        }

        /* GUARANTEED ALARM FULL SCREEN OVERLAY */
        .alarm-screen-overlay {
          position: fixed; inset: 0; background: rgba(17, 22, 20, 0.92);
          backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center;
          z-index: 999999; padding: 20px; box-sizing: border-box;
        }
        .alarm-modal {
          width: 100%; max-width: 340px; background: var(--white); border-radius: 32px;
          padding: 24px 20px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          animation: alarmPulse 1.2s infinite alternate ease-in-out;
        }
        @keyframes alarmPulse {
          0% { transform: scale(0.98); box-shadow: 0 0 20px rgba(217, 138, 43, 0.4); }
          100% { transform: scale(1.02); box-shadow: 0 0 35px rgba(179, 63, 51, 0.7); }
        }
        .alarm-bell-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--marigold);
          display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 12px;
          animation: ring 0.6s infinite alternate;
        }
        .alarm-bell-icon.water { background: var(--blue); }
        @keyframes ring { 0% { transform: rotate(-15deg); } 100% { transform: rotate(15deg); } }
        .alarm-title { font-family: 'Fraunces', serif; font-size: 20px; color: var(--ink); margin: 0 0 4px; font-weight: 700; }
        .alarm-time { font-size: 13px; font-weight: 900; color: var(--marigold); margin-bottom: 8px; }
        .alarm-desc { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); line-height: 1.4; margin-bottom: 18px; }

        .alarm-ack-btn {
          width: 100%; background: var(--green); color: #fff; border: none;
          border-radius: 16px; padding: 14px; font-size: 14.5px; font-weight: 900;
          cursor: pointer; box-shadow: 0 8px 20px rgba(63,107,79,0.4); margin-bottom: 16px;
        }

        .snooze-header { font-size: 11px; font-weight: 800; color: var(--ink-soft); margin-bottom: 8px; text-transform: uppercase; }
        .snooze-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
        .snooze-btn {
          background: var(--canvas); border: 1.5px solid #C7D3C9; border-radius: 10px;
          padding: 8px 2px; font-size: 11px; font-weight: 900; color: var(--ink); cursor: pointer;
          transition: all 0.15s ease;
        }
        .snooze-btn:hover { background: var(--marigold-tint); border-color: var(--marigold); color: #8A5A1C; }
        .snooze-btn.instant { border-color: var(--blue); color: var(--blue); background: var(--green-tint); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.5);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 30px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
        }
        .sheet h3 { margin: 0 0 16px 0; font-family: 'Fraunces', serif; font-size: 19px; color: var(--ink); }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; font-size: 11.5px; font-weight: 800; color: var(--ink-soft); margin-bottom: 5px; }
        .form-group select, .form-group input {
          width: 100%; padding: 12px 14px; border-radius: 14px; border: 1.5px solid var(--green-tint);
          background: var(--canvas); font-size: 14px; font-family: inherit; font-weight: 700; color: var(--ink); outline: none; box-sizing: border-box;
        }
        .form-btns { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; }
        .submit-btn { background: var(--green); color: #fff; border: none; border-radius: 16px; padding: 14px; font-weight: 800; font-size: 14.5px; cursor: pointer; }
        .cancel-btn { background: var(--canvas); border: 1.5px solid #C7D3C9; color: var(--ink); border-radius: 16px; padding: 12px; font-weight: 800; font-size: 13.5px; cursor: pointer; }
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
            <h1>Reminders</h1>
          </div>

          <div className="content">
            <div className="section-label">Water Reminder</div>
            <div className="water-card">
              <div className="water-card-top">
                <div className="label">Background Reminder</div>
                <button
                  className="water-test-btn"
                  onClick={() => triggerAlarm({
                    id: 'water-test',
                    title: 'Drink Water',
                    displayTime: 'Now',
                    period: 'AM',
                    type: 'water',
                    enabled: true,
                    voiceMessage: 'Attention please! It is time to drink a glass of fresh water. Please pause your activity and stay hydrated.'
                  })}
                >
                  🔔 Test Water Alarm
                </button>
              </div>
              <div className="title">A gentle nudge to drink water, all day</div>
              <div className="water-controls">
                <button
                  className="step-btn"
                  onClick={() => setWaterInterval(prev => Math.max(0.5, +(prev - 0.5).toFixed(1)))}
                >
                  −
                </button>
                <span className="interval-text">Every {waterInterval} hours</span>
                <button
                  className="step-btn"
                  onClick={() => setWaterInterval(prev => +(prev + 0.5).toFixed(1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="callout">
              🔔 Voice ringtone announces the task aloud. Screen pauses until marked complete or shuffled.
            </div>

            <div className="section-label">Daily Reminders</div>
            {reminders
              .filter(r => r.type === 'daily')
              .map(r => (
                <div key={r.id} className="rem-card">
                  <div className="rem-time-box">
                    <div className="t">{r.displayTime}</div>
                    <div className="p">{r.period}</div>
                  </div>
                  <div className="rem-info">
                    <h4>{r.title}</h4>
                    <p>{r.repeat}</p>
                  </div>
                  <div className="rem-actions">
                    <button className="test-bell-btn" onClick={() => triggerAlarm(r)} title="Test Voice Alarm">
                      🔔 Test
                    </button>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={r.enabled}
                        onChange={() => handleToggleReminder(r.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}

            <button className="add-rem-btn" onClick={() => { setNewType('daily'); setShowAddModal(true); }}>
              + Add reminder
            </button>

            <div className="section-label" style={{ marginTop: '22px' }}>Medicine Reminders</div>
            {reminders
              .filter(r => r.type === 'medicine')
              .map(r => (
                <div key={r.id} className="rem-card">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--marigold-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginRight: '4px' }}>
                    💊
                  </div>
                  <div className="rem-time-box">
                    <div className="t">{r.displayTime}</div>
                    <div className="p">{r.period}</div>
                  </div>
                  <div className="rem-info">
                    <h4>{r.title}</h4>
                    <p>{r.repeat}</p>
                  </div>
                  <div className="rem-actions">
                    <button className="test-bell-btn" onClick={() => triggerAlarm(r)} title="Test Voice Alarm">
                      🔔 Test
                    </button>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={r.enabled}
                        onChange={() => handleToggleReminder(r.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}

            <button className="add-rem-btn" onClick={() => { setNewType('medicine'); setShowAddModal(true); }}>
              + Add medicine reminder
            </button>
          </div>
        </div>
      </div>

      {/* GUARANTEED FULL SCREEN ALARM POPUP (TRIGGERED EVEN AFTER SNOOZE) */}
      {activeAlarm && (
        <div className="alarm-screen-overlay">
          <div className="alarm-modal">
            <div className={`alarm-bell-icon ${activeAlarm.type === 'water' ? 'water' : ''}`}>
              {activeAlarm.type === 'water' ? '💧' : activeAlarm.type === 'medicine' ? '💊' : '⏰'}
            </div>
            <h2 className="alarm-title">{activeAlarm.title}</h2>
            <div className="alarm-time">🔔 Scheduled at {activeAlarm.displayTime} {activeAlarm.period || ''}</div>
            <p className="alarm-desc">
              {activeAlarm.type === 'water'
                ? 'Please pause what you are doing and drink a glass of fresh water to stay hydrated.'
                : activeAlarm.type === 'medicine'
                ? `Please pause what you are doing right now and take your medicine: ${activeAlarm.title}.`
                : `Your reminder for "${activeAlarm.title}" is active. Please complete this task.`}
            </p>

            <button className="alarm-ack-btn" onClick={stopVoiceAlarm}>
              {activeAlarm.type === 'water' ? '✅ I Drank Water' : '✅ I Have Completed This'}
            </button>

            {/* SNOOZE / SHUFFLE OPTIONS */}
            <div className="snooze-header">⏰ Or Remind Me Later</div>
            <div className="snooze-grid">
              <button className="snooze-btn instant" onClick={() => handleSnooze(5, true)}>+5s (Test)</button>
              <button className="snooze-btn" onClick={() => handleSnooze(5)}>+5m</button>
              <button className="snooze-btn" onClick={() => handleSnooze(10)}>+10m</button>
              <button className="snooze-btn" onClick={() => handleSnooze(15)}>+15m</button>
              <button className="snooze-btn" onClick={() => handleSnooze(20)}>+20m</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <h3>Add New {newType === 'medicine' ? 'Medicine' : 'Daily'} Reminder</h3>
            <form onSubmit={handleAddReminder}>
              <div className="form-group">
                <label>Reminder Name / Medicine</label>
                <input
                  type="text"
                  placeholder={newType === 'medicine' ? 'e.g. Blood Pressure Pill' : 'e.g. Afternoon Walk'}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Scheduled Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  required
                />
              </div>

              {newType === 'medicine' && (
                <div className="form-group">
                  <label>Dosage Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 tablet after food"
                    value={newDosage}
                    onChange={e => setNewDosage(e.target.value)}
                  />
                </div>
              )}

              <div className="form-btns">
                <button type="submit" className="submit-btn">Set Voice Alarm</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}