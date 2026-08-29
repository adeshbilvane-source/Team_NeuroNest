import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface YogaStep {
  stepNumber: number;
  title: string;
  instruction: string;
  stageImage: string;
  durationSec: number;
}

interface YogaPose {
  id: string;
  name: string;
  sanskrit: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  benefits: string;
  steps: YogaStep[];
}

const YOGA_POSES: YogaPose[] = [
  {
    id: 'tadasana',
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/5NxDs-ovJU8?si=fJAkWmnsVI6oRebx&autoplay=1&mute=1&rel=0',
    description: 'A steady, grounding standing posture that improves posture, balance, and quiet focus for seniors.',
    benefits: 'Improves posture, strengthens thighs and ankles, reduces flat feet symptoms.',
    steps: [
      {
        stepNumber: 1,
        title: 'Feet Alignment & Foundation',
        instruction: 'Stand tall with feet hip-width apart. Spread your toes wide and ground all four corners of your feet into the floor.',
        stageImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        durationSec: 15
      },
      {
        stepNumber: 2,
        title: 'Lengthen Spine & Relax Arms',
        instruction: 'Let your arms hang comfortably by your sides with palms facing forward. Roll your shoulders up and gently back.',
        stageImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        durationSec: 20
      },
      {
        stepNumber: 3,
        title: 'Deep Rhythmic Breathing',
        instruction: 'Inhale slowly through your nose expanding your chest, and exhale gently while relaxing your neck and jaw.',
        stageImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        durationSec: 25
      }
    ]
  },
  {
    id: 'tree-pose',
    name: 'Supported Tree Pose',
    sanskrit: 'Vrikshasana',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/QeYhMXJWpJg?si=p9PQH03eFz_f8u2F&autoplay=1&mute=1&rel=0',
    description: 'A gentle balance-building pose practiced with a wall or chair for safe, fall-free stability.',
    benefits: 'Enhances neuromuscular coordination, strengthens calves, and fosters mental calm.',
    steps: [
      {
        stepNumber: 1,
        title: 'Steady Stand by Wall/Chair',
        instruction: 'Stand upright near a sturdy wall or chair. Place one hand lightly on the support for complete balance.',
        stageImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        durationSec: 15
      },
      {
        stepNumber: 2,
        title: 'Place Foot on Ankle / Shin',
        instruction: 'Shift your weight onto your standing leg. Place the sole of your other foot against your ankle or lower calf. Never on the knee.',
        stageImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        durationSec: 20
      },
      {
        stepNumber: 3,
        title: 'Find Focus Point & Hold',
        instruction: 'Fix your gaze on a still point in front of you. Take 4 calm, steady breaths, then gently lower your foot.',
        stageImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        durationSec: 25
      }
    ]
  },
  {
    id: 'chair-twist',
    name: 'Seated Chair Twist',
    sanskrit: 'Ardha Matsyendrasana',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/yYy6w8_hLTE?si=WTHNboYvN0kKeDJc&autoplay=1&mute=1&rel=0',
    description: 'A gentle spinal rotation while sitting safely on a chair to release lower back tension and aid digestion.',
    benefits: 'Increases spinal flexibility, relaxes tight shoulders, and stimulates internal organs.',
    steps: [
      {
        stepNumber: 1,
        title: 'Sit Tall on Chair',
        instruction: 'Sit comfortably with a straight spine, feet flat on the ground and knees aligned directly over ankles.',
        stageImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        durationSec: 15
      },
      {
        stepNumber: 2,
        title: 'Gentle Gentle Torso Turn',
        instruction: 'Inhale to lengthen your spine. On exhale, place your right hand on the back of the chair and left hand on your right thigh.',
        stageImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        durationSec: 20
      },
      {
        stepNumber: 3,
        title: 'Hold & Repeat Other Side',
        instruction: 'Hold the mild twist for 3 deep breaths without straining. Return slowly to center and repeat on the opposite side.',
        stageImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        durationSec: 25
      }
    ]
  },
  {
    id: 'seated-forward-bend',
    name: 'Seated Forward Fold',
    sanskrit: 'Paschimottanasana',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/AD_ztq7IhRU?si=_NQOzJNaHtf44gDJ&autoplay=1&mute=1&rel=0',
    description: 'A soothing seated stretch that calms the nervous system and relaxes tight hamstrings.',
    benefits: 'Calms the mind, relieves mild fatigue, and gently stretches the posterior chain.',
    steps: [
      {
        stepNumber: 1,
        title: 'Seated Posture Setup',
        instruction: 'Sit on a firm chair or mat with legs extended straight in front, heels resting softly on the floor.',
        stageImage: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
        durationSec: 15
      },
      {
        stepNumber: 2,
        title: 'Hinge at the Hips',
        instruction: 'Inhale, lifting your spine tall. Exhaling, fold gently forward from your hip joints, keeping your back long.',
        stageImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
        durationSec: 20
      },
      {
        stepNumber: 3,
        title: 'Rest Hands on Shins',
        instruction: 'Rest your hands on your shins or thighs. Keep your neck relaxed and breathe calmly into your back ribs.',
        stageImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
        durationSec: 25
      }
    ]
  },
  {
    id: 'cat-cow',
    name: 'Gentle Cat-Cow Flow',
    sanskrit: 'Marjaryasana-Bitilasana',
    thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/5NxDs-ovJU8?si=fJAkWmnsVI6oRebx&autoplay=1&mute=1&rel=0',
    description: 'A rhythmic flexion and extension of the spine that eases stiffness and restores natural back movement.',
    benefits: 'Improves spinal circulation, relieves lower back stiffness, and synchronizes breath with movement.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tabletop / Chair Support',
        instruction: 'Start on all fours with padded knees or seated tall on a chair with hands resting on your knees.',
        stageImage: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&auto=format&fit=crop&q=80',
        durationSec: 15
      },
      {
        stepNumber: 2,
        title: 'Cow Pose (Inhale)',
        instruction: 'Inhale slowly, gently drop your belly, and lift your chest forward while drawing shoulders back.',
        stageImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
        durationSec: 20
      },
      {
        stepNumber: 3,
        title: 'Cat Pose (Exhale)',
        instruction: 'Exhale deeply, gently round your spine toward the ceiling, and softly lower your chin toward your chest.',
        stageImage: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&auto=format&fit=crop&q=80',
        durationSec: 25
      }
    ]
  }
];

export default function YogaPage() {
  const navigate = useNavigate();
  const [selectedPose, setSelectedPose] = useState<YogaPose>(YOGA_POSES[0]);
  const [showDetailView, setShowDetailView] = useState<boolean>(false);
  const [isGuiding, setIsGuiding] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(15);

  const activePose = selectedPose ?? YOGA_POSES[0];

  const timerRef = useRef<any>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Save Completed Session to Analytics
  const saveYogaSessionToAnalytics = (mins: number) => {
    const raw = localStorage.getItem('sahayak_yoga_analytics');
    const logs = raw ? JSON.parse(raw) : {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (!logs[todayKey]) logs[todayKey] = { minutes: 0, sessions: 0 };
    logs[todayKey].minutes += Math.max(1, mins);
    logs[todayKey].sessions += 1;

    localStorage.setItem('sahayak_yoga_analytics', JSON.stringify(logs));
  };

  // Voice guidance intentionally disabled while video is playing.

  // Handle Step Countdown
  useEffect(() => {
    if (!isGuiding) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const currentStep = activePose.steps[currentStepIdx];
    setTimerSeconds(currentStep.durationSec);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Next step or finish
          if (currentStepIdx < activePose.steps.length - 1) {
            setCurrentStepIdx(idx => idx + 1);
          } else {
            // Session Completed
            clearInterval(timerRef.current);
            setIsGuiding(false);
            const totalElapsedMins = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 60000));
            saveYogaSessionToAnalytics(totalElapsedMins);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            alert('🎉 Session complete! Logged to your daily health report.');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGuiding, currentStepIdx, selectedPose]);

  const handleStartSession = () => {
    sessionStartTimeRef.current = Date.now();
    setCurrentStepIdx(0);
    setIsGuiding(true);
  };

  const handleStopSession = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGuiding(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className="yoga-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --purple: #6B4E9B; --purple-tint: #EFE9F6;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .yoga-root-container {
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
        .content { flex: 1; overflow-y: auto; padding: 16px 18px 26px 18px; }

        .sub-header-msg { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); line-height: 1.4; margin-bottom: 14px; }

        /* Pose Selection Grid */
        .pose-carousel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .pose-chip-card {
          width: 100%; text-align: center; cursor: pointer;
        }
        .pose-thumb-wrap {
          width: 100%; height: 120px; border-radius: 20px; overflow: hidden;
          border: 2.5px solid transparent; box-shadow: var(--shadow); background: var(--white);
          position: relative; transition: all 0.2s ease;
        }
        .pose-chip-card.active .pose-thumb-wrap {
          border-color: var(--purple); transform: scale(1.04); box-shadow: 0 6px 16px rgba(107,78,155,0.3);
        }
        .pose-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .pose-chip-name { font-size: 11px; font-weight: 800; color: var(--ink); margin-top: 6px; line-height: 1.2; }

        /* Main View Card */
        .main-card {
          background: var(--white); border-radius: 24px; padding: 16px; box-shadow: var(--shadow);
          margin-bottom: 14px;
        }
        .main-hero-img-wrap {
          width: 100%; height: 210px; border-radius: 18px; overflow: hidden;
          background: var(--purple-tint); margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .main-hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .pose-heading { text-align: center; margin-bottom: 12px; }
        .pose-heading h2 { font-family: 'Fraunces', serif; font-style: italic; font-size: 20px; margin: 0; color: var(--ink); }
        .pose-heading span { font-size: 12px; font-weight: 800; color: var(--purple); }

        .desc-block { background: var(--canvas); border-radius: 16px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px; font-weight: 700; color: var(--ink-soft); line-height: 1.5; }
        .benefits-block { margin-bottom: 16px; font-size: 12px; font-weight: 700; color: var(--ink); }

        .start-btn {
          width: 100%; background: var(--purple); color: #fff; border: none;
          border-radius: 18px; padding: 15px; font-size: 15px; font-weight: 900;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 8px 20px rgba(107,78,155,0.35); font-family: inherit;
        }

        /* Interactive Guided Mode Box */
        .guided-active-box {
          background: var(--white); border-radius: 24px; padding: 18px 16px;
          box-shadow: 0 10px 30px rgba(107,78,155,0.18); border: 2px solid var(--purple-tint);
        }
        .guided-timer-bar {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px; background: var(--purple-tint); padding: 8px 14px; border-radius: 14px;
        }
        .step-tag { font-size: 12px; font-weight: 900; color: var(--purple); }
        .timer-badge { font-size: 15px; font-weight: 900; color: var(--purple); background: var(--white); padding: 2px 10px; border-radius: 10px; }

        .stage-photo-frame {
          width: 100%; height: 210px; border-radius: 16px; overflow: hidden;
          margin-bottom: 14px; background: #eee;
        }
        .stage-photo-frame img { width: 100%; height: 100%; object-fit: cover; }
        .stage-photo-frame iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
          background: #000;
        }

        .step-instruction-box {
          background: var(--canvas); border-left: 4px solid var(--purple); border-radius: 14px;
          padding: 12px 14px; margin-bottom: 14px;
        }
        .step-instruction-box h4 { margin: 0 0 4px; font-size: 14px; font-weight: 900; color: var(--ink); }
        .step-instruction-box p { margin: 0; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); line-height: 1.45; }

        .guided-controls { display: flex; gap: 8px; }
        .guided-btn-next { flex: 2; background: var(--purple); color: #fff; border: none; border-radius: 14px; padding: 12px; font-weight: 900; font-size: 13.5px; cursor: pointer; }
        .guided-btn-stop { flex: 1; background: var(--canvas); border: 1.5px solid #C7D3C9; color: var(--ink); border-radius: 14px; padding: 12px; font-weight: 800; font-size: 13px; cursor: pointer; }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <button
              className="back-btn"
              onClick={() => {
                handleStopSession();
                if (showDetailView) {
                  setShowDetailView(false);
                } else {
                  navigate('/patient');
                }
              }}
              aria-label="Back"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <h1>Gentle Yoga &amp; Rest</h1>
          </div>

          <div className="content">
            {!showDetailView ? (
              <>
                <div className="sub-header-msg">
                  Simple, gentle poses guided step by step with spoken voice instructions.
                </div>

                <div className="pose-carousel">
                  {YOGA_POSES.map((pose) => (
                    <div
                      key={pose.id}
                      className={`pose-chip-card ${activePose.id === pose.id ? 'active' : ''}`}
                      onClick={() => {
                        handleStopSession();
                        setSelectedPose(pose);
                        setShowDetailView(true);
                      }}
                    >
                      <div className="pose-thumb-wrap">
                        <img src={pose.thumbnail} alt={pose.name} />
                      </div>
                      <div className="pose-chip-name">{pose.name}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : isGuiding ? (
              <div className="guided-active-box">
                <div className="guided-timer-bar">
                  <span className="step-tag">
                    Step {activePose.steps[currentStepIdx].stepNumber} of {activePose.steps.length}
                  </span>
                  <span className="timer-badge">⏱ {timerSeconds}s</span>
                </div>

                <div className="stage-photo-frame">
                  <iframe
                    src={activePose.videoUrl}
                    title={`${activePose.name} demo video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="step-instruction-box">
                  <h4>{activePose.steps[currentStepIdx].title}</h4>
                  <p>{activePose.steps[currentStepIdx].instruction}</p>
                </div>

                <div className="guided-controls">
                  <button
                    className="guided-btn-next"
                    onClick={() => {
                      if (currentStepIdx < activePose.steps.length - 1) {
                        setCurrentStepIdx(prev => prev + 1);
                      } else {
                        handleStopSession();
                        saveYogaSessionToAnalytics(1);
                        alert('🎉 Great work! Session completed and recorded.');
                      }
                    }}
                  >
                    {currentStepIdx < activePose.steps.length - 1 ? 'Next Step ➔' : 'Finish Session ✅'}
                  </button>

                  <button className="guided-btn-stop" onClick={handleStopSession}>
                    End
                  </button>
                </div>
              </div>
            ) : (
              <div className="main-card">
                <div className="main-hero-img-wrap">
                  <img src={activePose.thumbnail} alt={activePose.name} />
                </div>

                <div className="pose-heading">
                  <h2>{activePose.name}</h2>
                  <span>({activePose.sanskrit})</span>
                </div>

                <div className="desc-block">
                  {activePose.description}
                </div>

                <div className="benefits-block">
                  🌿 <b>Key Benefits:</b> {activePose.benefits}
                </div>

                <button className="start-btn" onClick={handleStartSession}>
                  ▶ Start guided session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}