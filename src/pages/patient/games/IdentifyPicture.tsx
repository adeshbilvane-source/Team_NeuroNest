import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuestionItem {
  id: string;
  display: string; // Emoji, icon ya base64 image URL
  isImage: boolean;
  name: string;
  category: 'random' | 'family' | 'surroundings';
}

interface CustomPhoto {
  id: string;
  imageUrl: string;
  label: string; // e.g. "Brother", "Mother", "Living Room"
  type: 'family' | 'surroundings';
}

// Built-in 50+ Random Database (Vehicles, Animals, Objects, Food)
const RANDOM_DATA: { name: string; icon: string }[] = [
  { name: 'Car', icon: '🚗' },
  { name: 'Motorcycle', icon: '🏍️' },
  { name: 'Aeroplane', icon: '✈️' },
  { name: 'Bicycle', icon: '🚲' },
  { name: 'Bus', icon: '🚌' },
  { name: 'Train', icon: '🚆' },
  { name: 'Dog', icon: '🐕' },
  { name: 'Cat', icon: '🐈' },
  { name: 'Elephant', icon: '🐘' },
  { name: 'Lion', icon: '🦁' },
  { name: 'Cow', icon: '🐄' },
  { name: 'Horse', icon: '🐎' },
  { name: 'Apple', icon: '🍎' },
  { name: 'Banana', icon: '🍌' },
  { name: 'Mango', icon: '🥭' },
  { name: 'Tea Cup', icon: '☕' },
  { name: 'Chair', icon: '🪑' },
  { name: 'Clock', icon: '⏰' },
  { name: 'Umbrella', icon: '☂️' },
  { name: 'House', icon: '🏠' },
  { name: 'Tree', icon: '🌳' },
  { name: 'Guitar', icon: '🎸' },
  { name: 'Book', icon: '📖' },
  { name: 'Telephone', icon: '☎️' },
  { name: 'Spectacles', icon: '👓' }
];

export default function IdentifyPicture() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab Mode
  const [tab, setTab] = useState<'Random' | 'Family photos' | 'My surroundings'>('Random');

  // Game Level Progression (1 to 100)
  const [level, setLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('sahayak_identify_level') || '1', 10);
  });

  // Custom Uploads
  const [customPhotos, setCustomPhotos] = useState<CustomPhoto[]>(() => {
    return JSON.parse(localStorage.getItem('sahayak_custom_photos') || '[]');
  });

  // Upload Dialog State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [photoLabel, setPhotoLabel] = useState<string>('Brother');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Current Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Generate Question based on Level and Selected Tab
  const generateQuiz = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Number of options increases with difficulty
    let optionCount = 3;
    if (level > 30) optionCount = 6;
    else if (level > 10) optionCount = 4;

    if (tab === 'Random') {
      const target = RANDOM_DATA[Math.floor(Math.random() * RANDOM_DATA.length)];
      const distractors = RANDOM_DATA.filter(d => d.name !== target.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1)
        .map(d => d.name);

      const allOptions = [...distractors, target.name].sort(() => Math.random() - 0.5);

      setCurrentQuestion({
        id: 'rand-' + Date.now(),
        display: target.icon,
        isImage: false,
        name: target.name,
        category: 'random'
      });
      setOptions(allOptions);
    } else {
      // Family or Surroundings Mode
      const targetType = tab === 'Family photos' ? 'family' : 'surroundings';
      const available = customPhotos.filter(p => p.type === targetType);

      if (available.length === 0) {
        setCurrentQuestion(null);
        setOptions([]);
        return;
      }

      const target = available[Math.floor(Math.random() * available.length)];
      
      const defaultPool = tab === 'Family photos' 
        ? ['Father', 'Mother', 'Brother', 'Sister', 'Son', 'Daughter', 'Grandson', 'Friend']
        : ['Living Room', 'Kitchen', 'Bedroom', 'Balcony', 'Garden', 'Temple Area', 'Main Door'];

      const otherLabels = defaultPool.filter(l => l.toLowerCase() !== target.label.toLowerCase())
        .sort(() => Math.random() - 0.5)
        .slice(0, optionCount - 1);

      const allOptions = [...otherLabels, target.label].sort(() => Math.random() - 0.5);

      setCurrentQuestion({
        id: target.id,
        display: target.imageUrl,
        isImage: true,
        name: target.label,
        category: targetType
      });
      setOptions(allOptions);
    }
  };

  useEffect(() => {
    generateQuiz();
  }, [tab, level, customPhotos]);

  // Answer Evaluation & Level Up
  const handleSelectOption = (chosen: string) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(chosen);
    const correct = chosen.toLowerCase() === currentQuestion.name.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (level < 100) {
          const nextLvl = level + 1;
          setLevel(nextLvl);
          localStorage.setItem('sahayak_identify_level', nextLvl.toString());
        }
        generateQuiz();
      }, 1200);
    }
  };

  // Handle Photo Upload / Camera Capture
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

    const newPhoto: CustomPhoto = {
      id: 'photo-' + Date.now(),
      imageUrl: capturedImage,
      label: photoLabel.trim(),
      type: tab === 'Family photos' ? 'family' : 'surroundings'
    };

    const updated = [...customPhotos, newPhoto];
    setCustomPhotos(updated);
    localStorage.setItem('sahayak_custom_photos', JSON.stringify(updated));

    setCapturedImage(null);
    setShowUploadModal(false);
    alert(`Saved photo for "${photoLabel}"!`);
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

        /* Chips navigation */
        .chip-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 12px; }
        .chip {
          background: var(--white); border: 1.5px solid var(--green-tint); color: var(--green);
          font-weight: 800; font-size: 12px; padding: 7px 14px; border-radius: 20px; cursor: pointer; white-space: nowrap;
        }
        .chip.active { background: var(--green); color: #fff; border-color: var(--green); }

        /* Upload box */
        .upload-card {
          border: 2px dashed #B8C7BA; border-radius: 18px; padding: 14px; text-align: center;
          color: var(--ink); font-size: 12.5px; font-weight: 800; margin-bottom: 14px; background: var(--white);
        }
        .upload-btn {
          margin-top: 8px; background: var(--green); color: #fff; border: none; border-radius: 12px;
          padding: 8px 16px; font-size: 12px; font-weight: 800; cursor: pointer;
        }

        /* Picture display box */
        .quiz-image-frame {
          width: 100%; aspect-ratio: 4/3; background: var(--white); border-radius: 22px;
          box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center;
          overflow: hidden; margin-bottom: 16px; position: relative; border: 2px solid var(--green-tint);
        }
        .emoji-display { font-size: 80px; }
        .photo-img { width: 100%; height: 100%; object-fit: cover; }

        .question-prompt {
          text-align: center; font-family: 'Fraunces', serif; font-size: 17px;
          font-weight: 600; color: var(--ink); margin-bottom: 14px;
        }

        /* MCQ Options Grid */
        .mcq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
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

        /* Upload Modal */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 100;
        }
        .modal-box {
          background: var(--white); border-radius: 24px; padding: 20px; width: 310px; max-width: 90%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25); text-align: center;
        }
        .modal-preview {
          width: 100%; height: 160px; object-fit: cover; border-radius: 14px; margin-bottom: 12px;
        }
        .modal-box select, .modal-box input {
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

          {/* Header with Level 1-100 Progress */}
          <div className="page-header">
            <div className="header-left">
              <button className="back-btn" onClick={() => navigate('/patient/games')} aria-label="Back">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <h1>Identify Picture</h1>
            </div>
            <div className="level-badge">⭐ Level {level} / 100</div>
          </div>

          <div className="content">
            {/* Category Tabs */}
            <div className="chip-row">
              {(['Random', 'Family photos', 'My surroundings'] as const).map(c => (
                <div
                  key={c}
                  className={`chip ${tab === c ? 'active' : ''}`}
                  onClick={() => setTab(c)}
                >
                  {c}
                </div>
              ))}
            </div>

            {/* Upload Box ONLY visible in Family photos & Surroundings */}
            {tab !== 'Random' && (
              <div className="upload-card">
                📸 Add {tab === 'Family photos' ? 'Family Member' : 'Room / Home'} Photo
                <br />
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷 Take / Upload Photo
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

            {/* Question Display Area */}
            {currentQuestion ? (
              <>
                <div className="quiz-image-frame">
                  {currentQuestion.isImage ? (
                    <img src={currentQuestion.display} alt="Quiz Item" className="photo-img" />
                  ) : (
                    <span className="emoji-display">{currentQuestion.display}</span>
                  )}
                </div>

                <div className="question-prompt">
                  {tab === 'Family photos'
                    ? 'Who is this person?'
                    : tab === 'My surroundings'
                    ? 'Which place is this?'
                    : 'What is shown in the picture?'}
                </div>

                {/* MCQ Options (Level-based count) */}
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
                <p style={{ fontWeight: 800, fontSize: '15px' }}>No photos added for {tab} yet!</p>
                <p style={{ fontSize: '12px' }}>Tap "Take / Upload Photo" above to add family faces or your home rooms to play.</p>
              </div>
            )}

            <div className="callout">
              {isCorrect === true && '🎉 Correct! Moving to the next level...'}
              {isCorrect === false && '❌ Incorrect, try another choice!'}
              {isCorrect === null && 'Choose the correct option matching the picture. Level increases difficulty!'}
            </div>
          </div>
        </div>
      </div>

      {/* Labeling Modal after Camera/File selection */}
      {showUploadModal && capturedImage && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Label this photo</h3>
            <img src={capturedImage} alt="Captured" className="modal-preview" />

            {tab === 'Family photos' ? (
              <select value={photoLabel} onChange={(e) => setPhotoLabel(e.target.value)}>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Grandson">Grandson</option>
                <option value="Granddaughter">Granddaughter</option>
                <option value="Friend">Friend</option>
              </select>
            ) : (
              <select value={photoLabel} onChange={(e) => setPhotoLabel(e.target.value)}>
                <option value="Living Room">Living Room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Garden">Garden</option>
                <option value="Balcony">Balcony</option>
                <option value="Temple Area">Temple Area</option>
                <option value="Main Door">Main Door</option>
              </select>
            )}

            <div className="modal-action-btns">
              <button style={{ background: 'var(--green)', color: '#fff' }} onClick={handleSaveCustomPhoto}>
                Save Photo
              </button>
              <button style={{ background: '#ddd', color: '#333' }} onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}