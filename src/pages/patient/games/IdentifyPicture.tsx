import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type CategoryTab = 'Random' | 'Family photos' | 'My surroundings';

interface QuestionItem {
  id: string;
  display: string;
  name: string;
  category: 'random' | 'family' | 'surroundings';
}

export interface LibraryPhoto {
  id: string;
  imageUrl: string;
  label: string;
  category: 'family' | 'surroundings' | 'general';
}

const REAL_RANDOM_DATA = [
  { name: 'Car', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80' },
  { name: 'Dog', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80' },
  { name: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80' },
  { name: 'Apple', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80' },
  { name: 'Banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Tea Cup', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80' },
  { name: 'House', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&auto=format&fit=crop&q=80' },
  { name: 'Tree', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80' },
  { name: 'Aeroplane', image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=500&auto=format&fit=crop&q=80' },
  { name: 'Bicycle', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Elephant', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&auto=format&fit=crop&q=80' },
  { name: 'Clock', image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=500&auto=format&fit=crop&q=80' }
];

export default function IdentifyPicture() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const familyMemberOptions = t('identifyPicture.familyMembers').split(',').map(value => value.trim()).filter(Boolean);
  const roomOptions = t('identifyPicture.rooms').split(',').map(value => value.trim()).filter(Boolean);

  const [tab, setTab] = useState<CategoryTab>('Random');

  const [levels, setLevels] = useState<{ [key in CategoryTab]: number }>(() => ({
    'Random': parseInt(localStorage.getItem('sahayak_level_random') || '1', 10),
    'Family photos': parseInt(localStorage.getItem('sahayak_level_family') || '1', 10),
    'My surroundings': parseInt(localStorage.getItem('sahayak_level_surroundings') || '1', 10)
  }));

  const currentLevel = levels[tab];

  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
  const [libraryPhotos, setLibraryPhotos] = useState<LibraryPhoto[]>(() => {
    return JSON.parse(localStorage.getItem('sahayak_library_photos') || '[]');
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoLabel, setPhotoLabel] = useState<string>('Brother');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const sessionStartRef = useRef<number>(Date.now());

  const saveAnalyticsTime = () => {
    const elapsedSeconds = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    if (elapsedSeconds < 2) return;

    const minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60));
    const raw = localStorage.getItem('sahayak_game_analytics');
    const analytics = raw ? JSON.parse(raw) : {};
    const todayKey = new Date().toISOString().split('T')[0];

    if (!analytics[todayKey]) analytics[todayKey] = {};
    if (!analytics[todayKey]['Identify Picture']) {
      analytics[todayKey]['Identify Picture'] = { minutes: 0, icon: '🖼️', color: '#8A5A1C' };
    }

    analytics[todayKey]['Identify Picture'].minutes += minutesSpent;
    localStorage.setItem('sahayak_game_analytics', JSON.stringify(analytics));
    sessionStartRef.current = Date.now();
  };

  useEffect(() => {
    return () => {
      saveAnalyticsTime();
    };
  }, []);

  const generateQuiz = (recovery: boolean = isRecoveryMode) => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    let optionCount = 2;
    if (!recovery) {
      if (currentLevel > 40) optionCount = 6;
      else if (currentLevel > 15) optionCount = 4;
      else optionCount = 3;
    }

    if (tab === 'Random') {
      const target = REAL_RANDOM_DATA[Math.floor(Math.random() * REAL_RANDOM_DATA.length)];
      const distractors = REAL_RANDOM_DATA
        .filter(d => d.name !== target.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1)
        .map(d => d.name);

      const allOptions = [...distractors, target.name].sort(() => Math.random() - 0.5);

      setCurrentQuestion({
        id: 'rand-' + Date.now(),
        display: target.image,
        name: target.name,
        category: 'random'
      });
      setOptions(allOptions);
    } else {
      const targetType = tab === 'Family photos' ? 'family' : 'surroundings';
      const available = libraryPhotos.filter(p => p.category === targetType);

      if (available.length === 0) {
        setCurrentQuestion(null);
        setOptions([]);
        return;
      }

      const target = available[Math.floor(Math.random() * available.length)];
      const defaultPool = tab === 'Family photos'
        ? familyMemberOptions.length > 0 ? familyMemberOptions : ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandson', 'Friend']
        : roomOptions.length > 0 ? roomOptions : ['Living Room', 'Kitchen', 'Bedroom', 'Balcony', 'Garden', 'Temple Area', 'Main Door'];

      const otherLabels = defaultPool
        .filter(l => l.toLowerCase() !== target.label.toLowerCase())
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1);

      const allOptions = [...otherLabels, target.label].sort(() => Math.random() - 0.5);

      setCurrentQuestion({
        id: target.id,
        display: target.imageUrl,
        name: target.label,
        category: targetType
      });
      setOptions(allOptions);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('sahayak_library_photos');
    if (raw) setLibraryPhotos(JSON.parse(raw));
  }, [tab]);

  useEffect(() => {
    generateQuiz(isRecoveryMode);
  }, [tab, currentLevel, libraryPhotos]);

  const handleSelectOption = (chosen: string) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(chosen);
    const correct = chosen.toLowerCase() === currentQuestion.name.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setIsRecoveryMode(false);
      saveAnalyticsTime();

      setTimeout(() => {
        if (currentLevel < 100) {
          const nextLvl = currentLevel + 1;
          const updatedLevels = { ...levels, [tab]: nextLvl };
          setLevels(updatedLevels);

          const storageKey =
            tab === 'Random'
              ? 'sahayak_level_random'
              : tab === 'Family photos'
              ? 'sahayak_level_family'
              : 'sahayak_level_surroundings';

          localStorage.setItem(storageKey, nextLvl.toString());
        }
        generateQuiz(false);
      }, 1000);
    } else {
      setIsRecoveryMode(true);
      setTimeout(() => {
        generateQuiz(true);
      }, 1000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomPhoto = () => {
    if (!capturedImage || !photoLabel.trim()) return;

    const newPhoto: LibraryPhoto = {
      id: 'photo-' + Date.now(),
      imageUrl: capturedImage,
      label: photoLabel.trim(),
      category: tab === 'Family photos' ? 'family' : 'surroundings'
    };

    const updated = [...libraryPhotos, newPhoto];
    setLibraryPhotos(updated);
    localStorage.setItem('sahayak_library_photos', JSON.stringify(updated));

    setCapturedImage(null);
    setShowUploadModal(false);
  };

  return (
    <div className="game-sub-root">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --marigold: #D98A2B;
          --marigold-tint: #FBEEDA; --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --red-tint: #F4DEDA;
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
        .chip-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 12px; }
        .chip {
          background: var(--white); border: 1.5px solid var(--green-tint); color: var(--green);
          font-weight: 800; font-size: 12px; padding: 7px 14px; border-radius: 20px; cursor: pointer; white-space: nowrap;
        }
        .chip.active { background: var(--green); color: #fff; border-color: var(--green); }
        .upload-card {
          border: 2px dashed #B8C7BA; border-radius: 18px; padding: 14px; text-align: center;
          color: var(--ink); font-size: 12.5px; font-weight: 800; margin-bottom: 14px; background: var(--white);
        }
        .upload-btn {
          margin-top: 8px; background: var(--green); color: #fff; border: none; border-radius: 12px;
          padding: 8px 16px; font-size: 12px; font-weight: 800; cursor: pointer;
        }
        .quiz-image-frame {
          width: 100%; aspect-ratio: 4/3; background: var(--white); border-radius: 22px;
          box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center;
          overflow: hidden; margin-bottom: 16px; border: 2px solid var(--green-tint);
        }
        .photo-img { width: 100%; height: 100%; object-fit: cover; }
        .question-prompt {
          text-align: center; font-family: 'Fraunces', serif; font-size: 17px;
          font-weight: 600; color: var(--ink); margin-bottom: 14px;
        }
        .mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mcq-btn {
          background: var(--white); border: 2px solid transparent; border-radius: 16px;
          padding: 14px 10px; font-size: 14.5px; font-weight: 800; color: var(--ink);
          box-shadow: var(--shadow); cursor: pointer; text-align: center; transition: all 0.15s ease;
          font-family: inherit;
        }
        .mcq-btn:active { transform: scale(0.97); }
        .mcq-btn.correct { background: var(--green-tint); border-color: var(--green); color: var(--green); font-weight: 900; }
        .mcq-btn.wrong { background: var(--red-tint); border-color: var(--red); color: var(--red); }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 10px 12px; font-size: 11.5px; color: #7a5015; font-weight: 700; line-height: 1.4; margin-top: 16px;
        }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 100;
        }
        .modal-box {
          background: var(--white); border-radius: 24px; padding: 20px; width: 310px; max-width: 90%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25); text-align: center;
        }
        .modal-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 14px; margin-bottom: 12px; }
        .modal-box select {
          width: 100%; padding: 10px 12px; border-radius: 12px; border: 1.5px solid var(--green-tint);
          margin-bottom: 12px; font-family: inherit; font-size: 14px; font-weight: 700; box-sizing: border-box;
        }
        .modal-action-btns { display: flex; gap: 8px; }
        .modal-action-btns button {
          flex: 1; padding: 12px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; font-size: 13px;
        }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <div className="header-left">
              <button className="back-btn" onClick={() => { saveAnalyticsTime(); navigate('/patient/games'); }} aria-label="Back">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <h1>{t('identifyPicture.title')}</h1>
            </div>
            <div className="level-badge">⭐ Level {currentLevel} / 100</div>
          </div>

          <div className="content">
            <div className="chip-row">
              {(['Random', 'Family photos', 'My surroundings'] as const).map(c => (
                <div
                  key={c}
                  className={`chip ${tab === c ? 'active' : ''}`}
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setTab(c);
                  }}
                >
                  {c} (Lvl {levels[c]})
                </div>
              ))}
            </div>

            {tab !== 'Random' && (
              <div className="upload-card">
                {tab === 'Family photos' ? t('identifyPicture.addFamilyPhoto') : t('identifyPicture.addRoomPhoto')}
                <br />
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('identifyPicture.takeUploadPhoto')}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
            )}

            {currentQuestion ? (
              <>
                <div className="quiz-image-frame">
                  <img src={currentQuestion.display} alt="Quiz Target" className="photo-img" />
                </div>

                <div className="question-prompt">
                  {tab === 'Family photos'
                    ? t('identifyPicture.whoIs')
                    : tab === 'My surroundings'
                    ? t('identifyPicture.whichPlace')
                    : t('identifyPicture.whatShown')}
                </div>

                <div className="mcq-grid">
                  {options.map((opt, idx) => {
                    let btnClass = 'mcq-btn';
                    if (selectedAnswer !== null) {
                      if (opt.toLowerCase() === currentQuestion.name.toLowerCase()) {
                        btnClass += ' correct';
                      } else if (opt === selectedAnswer && !isCorrect) {
                        btnClass += ' wrong';
                      }
                    }
                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => handleSelectOption(opt)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--ink-soft)' }}>
                <p style={{ fontWeight: 800, fontSize: '15px' }}>{t('identifyPicture.noPhotos', { tab })}</p>
                <p style={{ fontSize: '12px' }}>{t('identifyPicture.uploadPhotosHint', { level: currentLevel })}</p>
              </div>
            )}

            <div className="callout">
              {isCorrect === true && t('identifyPicture.correct', { level: currentLevel + 1, tab })}
              {isCorrect === false && t('identifyPicture.incorrect')}
              {isCorrect === null && t('identifyPicture.playingLevel', { tab, level: currentLevel })}
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && capturedImage && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{t('identifyPicture.labelPhoto')}</h3>
            <img src={capturedImage} alt="Captured" className="modal-preview" />

            {tab === 'Family photos' ? (
              <select value={photoLabel} onChange={(e) => setPhotoLabel(e.target.value)}>
                {(familyMemberOptions.length > 0 ? familyMemberOptions : ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandson', 'Granddaughter', 'Friend']).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="Custom">{t('familyPage.relationship.custom')}</option>
              </select>
            ) : (
              <select value={photoLabel} onChange={(e) => setPhotoLabel(e.target.value)}>
                {(roomOptions.length > 0 ? roomOptions : ['Living Room', 'Kitchen', 'Bedroom', 'Garden', 'Balcony', 'Temple Area', 'Main Door']).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="Custom">{t('familyPage.relationship.custom')}</option>
              </select>
            )}

            <div className="modal-action-btns">
              <button style={{ background: 'var(--green)', color: '#fff' }} onClick={handleSaveCustomPhoto}>
                {t('identifyPicture.savePhoto')}
              </button>
              <button style={{ background: '#ddd', color: '#333' }} onClick={() => setShowUploadModal(false)}>
                {t('identifyPicture.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}