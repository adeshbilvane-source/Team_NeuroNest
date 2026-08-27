import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideosLibraryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'videos' | 'library'>('videos');
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([0, 2, 5]);

  const toggleSelect = (idx: number) => {
    setSelectedPhotos(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="vid-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08); --red: #B33F33;
        }
        .vid-root-container {
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
        .page-header { padding: 44px 18px 0 18px; background: var(--white); box-shadow: var(--shadow); z-index: 2; }
        .header-top { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; }
        .back-btn {
          width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--ink); margin: 0; }
        .tabbar { display: flex; gap: 8px; padding-bottom: 14px; }
        .tab {
          padding: 10px 16px; border-radius: 20px; font-weight: 800; font-size: 13px; cursor: pointer;
          background: var(--green-tint); color: var(--green); border: none; font-family: inherit;
        }
        .tab.active { background: var(--green); color: #fff; }
        .content { flex: 1; overflow-y: auto; padding: 18px 18px 26px 18px; }
        .section-label {
          margin: 0 0 10px; font-size: 12px; font-weight: 900; color: var(--ink-soft);
          text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;
        }
        .add-link { color: var(--green); font-weight: 800; font-size: 11.5px; cursor: pointer; text-transform: none; letter-spacing: 0; }
        .folder-row { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 22px; }
        .folder { flex-shrink: 0; width: 82px; text-align: center; cursor: pointer; }
        .folder .ic {
          width: 100%; aspect-ratio: 1; background: var(--marigold-tint); border-radius: 16px; display: flex;
          align-items: center; justify-content: center; font-size: 26px; box-shadow: var(--shadow);
        }
        .folder.new .ic { background: var(--white); border: 2px dashed #C7D3C9; color: var(--ink-soft); }
        .folder p { margin: 6px 0 0; font-size: 10.5px; font-weight: 800; color: var(--ink); }
        .vid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 22px; }
        .vid-card { background: var(--white); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); }
        .thumb {
          aspect-ratio: 16/10; background: var(--green-tint); display: flex; align-items: center;
          justify-content: center; font-size: 26px; position: relative;
        }
        .thumb .play {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 28px; color: var(--green-dark);
        }
        .vid-info { padding: 10px 12px; }
        .vid-info h4 { margin: 0 0 3px; font-size: 12.5px; color: var(--ink); }
        .vid-info p { margin: 0; color: var(--ink-soft); font-size: 10.5px; font-weight: 700; }
        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 12px;
          padding: 11px 14px; font-size: 12px; color: #7a5015; font-weight: 700; line-height: 1.5; margin: 8px 0 4px;
        }
        .libbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 11.5px; color: var(--ink-soft); font-weight: 700; }
        .del-sel { background: var(--red); color: #fff; border: none; border-radius: 12px; padding: 8px 14px; font-weight: 800; font-size: 11.5px; cursor: pointer; font-family: inherit; }
        .lib-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
        .lib-item {
          position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 1;
          background: linear-gradient(135deg,var(--marigold-tint),#EAC488); display: flex; align-items: center; justify-content: center; font-size: 28px;
        }
        .lib-item .check {
          position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%;
          background: rgba(255,255,255,.9); border: 2px solid var(--green); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; color: var(--green);
        }
        .lib-item .check.checked { background: var(--green); color: #fff; }
      `}</style>

      <div className="phone-wrapper">
        <div className="phone-screen">
          <div className="notch"></div>

          <div className="page-header">
            <div className="header-top">
              <button className="back-btn" onClick={() => navigate('/patient')} aria-label="Back">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
              </button>
              <h1>Videos &amp; Library</h1>
            </div>
            <div className="tabbar">
              <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>📺 Videos</button>
              <button className={`tab ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>🗂️ Library</button>
            </div>
          </div>

          <div className="content">
            {tab === 'videos' ? (
              <div>
                <div className="section-label">Folders <span className="add-link" onClick={() => alert("New folder")}>+ New folder</span></div>
                <div className="folder-row">
                  <div className="folder"><div className="ic">👨‍👩‍👧</div><p>Family</p></div>
                  <div className="folder"><div className="ic">🌊</div><p>Calming</p></div>
                  <div className="folder"><div className="ic">🎵</div><p>Old songs</p></div>
                  <div className="folder new" onClick={() => alert("Create Folder")}><div className="ic">+</div><p>New</p></div>
                </div>

                <div className="section-label">Your uploads <span className="add-link" onClick={() => alert("Upload video")}>+ Upload</span></div>
                <div className="vid-grid">
                  <div className="vid-card"><div className="thumb">🎥<span className="play">▶</span></div><div className="vid-info"><h4>Grandson's birthday</h4><p>3:42 · Family</p></div></div>
                  <div className="vid-card"><div className="thumb">🎥<span className="play">▶</span></div><div className="vid-info"><h4>Trip to the temple</h4><p>1:58 · Unsorted</p></div></div>
                </div>

                <div className="section-label">Calming videos</div>
                <div className="vid-grid">
                  <div className="vid-card"><div className="thumb">🌅<span className="play">▶</span></div><div className="vid-info"><h4>Slow ocean waves</h4><p>10:00 · Calming</p></div></div>
                  <div className="vid-card"><div className="thumb">🌧️<span className="play">▶</span></div><div className="vid-info"><h4>Rain on a window</h4><p>12:00 · Suggested</p></div></div>
                </div>
                <div className="callout">Tap a folder to see only what's inside. Move videos between folders, rename or reorder them anytime.</div>
              </div>
            ) : (
              <div>
                <div className="libbar">
                  <span>9 photos · {selectedPhotos.length} selected</span>
                  <button className="del-sel" onClick={() => setSelectedPhotos([])}>🗑 Delete selected</button>
                </div>
                <div className="lib-grid">
                  {['🌸', '👨‍👩‍👧', '🏠', '🌳', '🐱', '🌅', '🍎', '🌻', '🐶'].map((emoji, idx) => (
                    <div key={idx} className="lib-item" onClick={() => toggleSelect(idx)}>
                      {emoji}
                      <div className={`check ${selectedPhotos.includes(idx) ? 'checked' : ''}`}>
                        {selectedPhotos.includes(idx) ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="callout">Tap a photo's circle to select it, then delete selected in one go. Removing a photo also removes it from any game or folder using it.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}