import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface LibraryPhoto {
  id: string;
  imageUrl: string;
  label: string;
  category: 'family' | 'surroundings' | 'general';
}

interface UploadedVideo {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  category: string;
  date: string;
}

interface CalmingVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  youtubeId: string;
  thumbnail: string;
}

// Curated YouTube Dementia Therapy & Calming Videos
const CALMING_YOUTUBE_VIDEOS: CalmingVideo[] = [
  {
    id: 'yt-1',
    title: 'Gentle Ocean Waves & Soft Breeze',
    duration: '15:00',
    category: 'Nature Calm',
    youtubeId: 'bn9F19Hi1Lk',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-2',
    title: 'Peaceful Rain on Forest Leaves',
    duration: '20:00',
    category: 'Relaxing Rain',
    youtubeId: 'q76bMs-NwRk',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-3',
    title: 'Sweet Morning Birds Chirping in Garden',
    duration: '12:00',
    category: 'Morning Calm',
    youtubeId: 'Qm846KdZN_c',
    thumbnail: 'https://images.unsplash.com/photo-1522926197415-e01049493f46?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-4',
    title: 'Soothing Bamboo Flute Meditation',
    duration: '30:00',
    category: 'Old Melodies',
    youtubeId: '4pLUleLdwY4',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-5',
    title: 'Playful Puppies & Cute Kittens Therapy',
    duration: '10:00',
    category: 'Joy & Pets',
    youtubeId: '1Hxgm3iZg70',
    thumbnail: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-6',
    title: 'Golden Sunset over Green Hills',
    duration: '14:00',
    category: 'Scenic Nature',
    youtubeId: 'sK9wS_p6k1E',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-7',
    title: 'Calming Mountain River Stream Sounds',
    duration: '18:00',
    category: 'Water Sound',
    youtubeId: 'vPhg6sc1Mk4',
    thumbnail: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-8',
    title: 'Warm Fireplace Crackling with Soft Music',
    duration: '25:00',
    category: 'Cozy Evening',
    youtubeId: 'L_LUpnjgPso',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-9',
    title: 'Indian Classical Sitar & Santoor Peace',
    duration: '20:00',
    category: 'Traditional',
    youtubeId: 'W1tzUf7sZ3I',
    thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yt-10',
    title: 'Colorful Blooming Flowers in Botanical Garden',
    duration: '11:00',
    category: 'Visual Relax',
    youtubeId: '2p89gS822zE',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop&q=80'
  }
];

export default function VideosLibraryPage() {
  const navigate = useNavigate();
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'videos' | 'library'>('videos');
  const [librarySubTab, setLibrarySubTab] = useState<'photos' | 'videos'>('photos');

  const [libraryPhotos, setLibraryPhotos] = useState<LibraryPhoto[]>([]);
  const [userVideos, setUserVideos] = useState<UploadedVideo[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  const [activePlayVideo, setActivePlayVideo] = useState<{ type: 'youtube' | 'local'; src: string; title: string } | null>(null);

  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [tempVideoUrl, setTempVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCategory, setVideoCategory] = useState<string>('Family');

  useEffect(() => {
    // 1. Photos
    const rawPhotos = localStorage.getItem('sahayak_library_photos');
    if (rawPhotos) {
      setLibraryPhotos(JSON.parse(rawPhotos));
    } else {
      const initial: LibraryPhoto[] = [
        { id: 'p1', label: 'Grandson', category: 'family', imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80' },
        { id: 'p2', label: 'Garden', category: 'surroundings', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80' }
      ];
      setLibraryPhotos(initial);
      localStorage.setItem('sahayak_library_photos', JSON.stringify(initial));
    }

    // 2. User Videos
    const rawVideos = localStorage.getItem('sahayak_user_videos');
    if (rawVideos) {
      setUserVideos(JSON.parse(rawVideos));
    } else {
      const initVids: UploadedVideo[] = [
        {
          id: 'v1',
          title: "Grandson's 5th Birthday",
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: '1:45',
          category: 'Family',
          date: '12 Aug'
        }
      ];
      setUserVideos(initVids);
      localStorage.setItem('sahayak_user_videos', JSON.stringify(initVids));
    }
  }, []);

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setTempVideoUrl(fileUrl);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      setShowVideoModal(true);
    }
  };

  const handleSaveVideo = () => {
    if (!tempVideoUrl || !videoTitle.trim()) return;

    const newVid: UploadedVideo = {
      id: 'uvid-' + Date.now(),
      title: videoTitle.trim(),
      videoUrl: tempVideoUrl,
      duration: '0:45',
      category: videoCategory,
      date: 'Today'
    };

    const updated = [newVid, ...userVideos];
    setUserVideos(updated);
    localStorage.setItem('sahayak_user_videos', JSON.stringify(updated));

    setShowVideoModal(false);
    setTempVideoUrl(null);
    setVideoTitle('');
    alert("Video successfully saved to Library!");
  };

  const handleDeletePhotos = () => {
    if (selectedPhotoIds.length === 0) return;
    const remaining = libraryPhotos.filter(p => !selectedPhotoIds.includes(p.id));
    setLibraryPhotos(remaining);
    localStorage.setItem('sahayak_library_photos', JSON.stringify(remaining));
    setSelectedPhotoIds([]);
  };

  const handleDeleteVideos = () => {
    if (selectedVideoIds.length === 0) return;
    const remaining = userVideos.filter(v => !selectedVideoIds.includes(v.id));
    setUserVideos(remaining);
    localStorage.setItem('sahayak_user_videos', JSON.stringify(remaining));
    setSelectedVideoIds([]);
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
        .notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 120px; height: 24px; background: #111614; border-radius: 20px; z-index: 10; }
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
        .content { flex: 1; overflow-y: auto; padding: 16px 18px 26px 18px; }

        .section-label {
          margin: 14px 0 10px; font-size: 12px; font-weight: 900; color: var(--ink-soft);
          text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;
        }
        .add-link { color: var(--green); font-weight: 900; font-size: 12px; cursor: pointer; text-transform: none; }

        /* Videos Grid */
        .vid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .vid-card { background: var(--white); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow); cursor: pointer; border: 1.5px solid transparent; }
        .vid-card:active { transform: scale(0.98); }
        .thumb {
          aspect-ratio: 16/10; background: #222; display: flex; align-items: center;
          justify-content: center; position: relative; overflow: hidden;
        }
        .thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
        .thumb .play-badge {
          position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.65);
          color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .vid-info { padding: 10px 12px; }
        .vid-info h4 { margin: 0 0 3px; font-size: 12.5px; font-weight: 800; color: var(--ink); line-height: 1.3; }
        .vid-info p { margin: 0; color: var(--ink-soft); font-size: 10px; font-weight: 700; }

        /* Library Sub Tabs */
        .lib-sub-nav { display: flex; gap: 8px; margin-bottom: 14px; margin-top: 4px; }
        .sub-tab {
          flex: 1; padding: 10px; border-radius: 14px; border: 1.5px solid var(--green-tint);
          background: var(--white); font-weight: 800; font-size: 13px; color: var(--ink-soft); cursor: pointer; text-align: center;
          transition: all 0.15s ease;
        }
        .sub-tab.active { background: var(--green); color: #fff; border-color: var(--green); box-shadow: var(--shadow); }

        /* Photo Grid */
        .lib-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
        .lib-item {
          position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 1;
          box-shadow: var(--shadow); border: 2.5px solid transparent; cursor: pointer;
        }
        .lib-item.selected { border-color: var(--green); }
        .lib-item-img { width: 100%; height: 100%; object-fit: cover; }
        .lib-item-tag {
          position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65);
          color: #fff; font-size: 9px; font-weight: 800; text-align: center; padding: 2px;
        }
        .lib-item .check {
          position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%;
          background: rgba(255,255,255,.9); border: 1.5px solid var(--green); display: flex;
          align-items: center; justify-content: center; font-size: 11px; color: var(--green);
        }
        .lib-item .check.checked { background: var(--green); color: #fff; }

        /* Video Player Modal */
        .player-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px;
        }
        .player-card {
          width: 100%; max-width: 360px; background: #fff; border-radius: 24px;
          overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .player-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
        .player-header h3 { margin: 0; font-size: 14px; color: var(--ink); }
        .close-player-btn { background: #eee; border: none; width: 30px; height: 30px; border-radius: 50%; font-weight: 900; cursor: pointer; }
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
              <h1>Videos &amp; Library</h1>
            </div>
            <div className="tabbar">
              <button className={`tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => setTab('videos')}>📺 Videos</button>
              <button className={`tab ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>🗂️ Library</button>
            </div>
          </div>

          <div className="content">
            {/* ================= TAB 1: VIDEOS ================= */}
            {tab === 'videos' ? (
              <div>
                {/* 1. Captured / Uploaded Videos */}
                <div className="section-label">
                  <span>Your Uploaded Videos</span>
                  <span className="add-link" onClick={() => videoInputRef.current?.click()}>+ Upload / Record</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  ref={videoInputRef}
                  style={{ display: 'none' }}
                  onChange={handleVideoFile}
                />

                {userVideos.length === 0 ? (
                  <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', textAlign: 'center', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 800 }}>No videos recorded yet. Tap "+ Upload / Record" to add family moments.</p>
                  </div>
                ) : (
                  <div className="vid-grid">
                    {userVideos.map(vid => (
                      <div
                        key={vid.id}
                        className="vid-card"
                        onClick={() => setActivePlayVideo({ type: 'local', src: vid.videoUrl, title: vid.title })}
                      >
                        <div className="thumb">
                          <span style={{ fontSize: '32px' }}>📹</span>
                          <div className="play-badge">▶</div>
                        </div>
                        <div className="vid-info">
                          <h4>{vid.title}</h4>
                          <p>{vid.duration} · {vid.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Curated 10+ Calming YouTube Videos */}
                <div className="section-label">
                  <span>Calming Videos (10+ Therapy)</span>
                </div>
                <div className="vid-grid">
                  {CALMING_YOUTUBE_VIDEOS.map(yt => (
                    <div
                      key={yt.id}
                      className="vid-card"
                      onClick={() => setActivePlayVideo({ type: 'youtube', src: yt.youtubeId, title: yt.title })}
                    >
                      <div className="thumb">
                        <img src={yt.thumbnail} alt={yt.title} />
                        <div className="play-badge">▶</div>
                      </div>
                      <div className="vid-info">
                        <h4>{yt.title}</h4>
                        <p>{yt.duration} · {yt.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ================= TAB 2: LIBRARY (PHOTOS & VIDEOS DIRECT VIEW) ================= */
              <div>
                <div className="lib-sub-nav">
                  <button
                    className={`sub-tab ${librarySubTab === 'photos' ? 'active' : ''}`}
                    onClick={() => setLibrarySubTab('photos')}
                  >
                    📸 Photos ({libraryPhotos.length})
                  </button>
                  <button
                    className={`sub-tab ${librarySubTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setLibrarySubTab('videos')}
                  >
                    🎥 Captured Videos ({userVideos.length})
                  </button>
                </div>

                {/* SECTION A: PHOTOS */}
                {librarySubTab === 'photos' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink-soft)' }}>
                        {selectedPhotoIds.length} Selected
                      </span>
                      {selectedPhotoIds.length > 0 && (
                        <button
                          style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                          onClick={handleDeletePhotos}
                        >
                          🗑 Delete Photos
                        </button>
                      )}
                    </div>

                    <div className="lib-grid">
                      {libraryPhotos.map(photo => {
                        const isSel = selectedPhotoIds.includes(photo.id);
                        return (
                          <div
                            key={photo.id}
                            className={`lib-item ${isSel ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedPhotoIds(prev =>
                                isSel ? prev.filter(i => i !== photo.id) : [...prev, photo.id]
                              );
                            }}
                          >
                            <img src={photo.imageUrl} alt={photo.label} className="lib-item-img" />
                            <div className="lib-item-tag">{photo.label}</div>
                            <div className={`check ${isSel ? 'checked' : ''}`}>{isSel ? '✓' : ''}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION B: VIDEOS */}
                {librarySubTab === 'videos' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink-soft)' }}>
                        {selectedVideoIds.length} Selected
                      </span>
                      {selectedVideoIds.length > 0 && (
                        <button
                          style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                          onClick={handleDeleteVideos}
                        >
                          🗑 Delete Videos
                        </button>
                      )}
                    </div>

                    <div className="vid-grid">
                      {userVideos.map(v => {
                        const isSel = selectedVideoIds.includes(v.id);
                        return (
                          <div
                            key={v.id}
                            className="vid-card"
                            style={{ borderColor: isSel ? 'var(--green)' : 'transparent' }}
                            onClick={() => {
                              setSelectedVideoIds(prev =>
                                isSel ? prev.filter(i => i !== v.id) : [...prev, v.id]
                              );
                            }}
                          >
                            <div className="thumb">
                              <span style={{ fontSize: '28px' }}>📹</span>
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 6,
                                  right: 6,
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  background: isSel ? 'var(--green)' : '#fff',
                                  color: isSel ? '#fff' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: 900
                                }}
                              >
                                ✓
                              </div>
                            </div>
                            <div className="vid-info">
                              <h4>{v.title}</h4>
                              <p>{v.category} · {v.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIDEO PLAYER MODAL */}
      {activePlayVideo && (
        <div className="player-modal-overlay" onClick={() => setActivePlayVideo(null)}>
          <div className="player-card" onClick={e => e.stopPropagation()}>
            <div className="player-header">
              <h3>{activePlayVideo.title}</h3>
              <button className="close-player-btn" onClick={() => setActivePlayVideo(null)}>✕</button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
              {activePlayVideo.type === 'youtube' ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${activePlayVideo.src}?autoplay=1`}
                  title={activePlayVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activePlayVideo.src}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD VIDEO LABEL MODAL */}
      {showVideoModal && (
        <div className="player-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="player-card" style={{ padding: '20px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px 0' }}>Save Recorded Video</h3>
            <input
              type="text"
              placeholder="Video Title (e.g. Garden Walk)"
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #ccc', marginBottom: '12px', boxSizing: 'border-box' }}
            />
            <select
              value={videoCategory}
              onChange={e => setVideoCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #ccc', marginBottom: '16px', boxSizing: 'border-box' }}
            >
              <option value="Family">Family</option>
              <option value="Calming">Calming</option>
              <option value="Daily Routine">Daily Routine</option>
              <option value="Memories">Memories</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{ flex: 1, background: 'var(--green)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}
                onClick={handleSaveVideo}
              >
                Save Video
              </button>
              <button
                style={{ flex: 1, background: '#eee', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}
                onClick={() => setShowVideoModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}