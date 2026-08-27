import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface FamilyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  availability: string;
  avatarUrl?: string;
}

export default function FamilyEmergencyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real Contacts State
  const [contacts, setContacts] = useState<FamilyContact[]>(() => {
    const raw = localStorage.getItem('sahayak_family_contacts');
    return raw ? JSON.parse(raw) : [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newRelation, setNewRelation] = useState<string>('Son');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAvailability, setNewAvailability] = useState<string>('Usually available');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sahayak_family_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact: FamilyContact = {
      id: 'fam-' + Date.now(),
      name: newName.trim(),
      relation: newRelation,
      phone: newPhone.trim(),
      availability: newAvailability.trim() || 'Available',
      avatarUrl: newAvatar || undefined
    };

    setContacts(prev => [...prev, newContact]);
    setNewName('');
    setNewPhone('');
    setNewAvatar(null);
    setShowAddModal(false);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Remove this family member?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="fam-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
        }
        .fam-root-container {
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

        .section-label {
          font-size: 11.5px; font-weight: 900; color: var(--ink-soft);
          text-transform: uppercase; letter-spacing: 0.6px; margin: 12px 0 10px;
        }

        .fam-card {
          background: var(--white); border-radius: 20px; padding: 14px 16px; box-shadow: var(--shadow);
          margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .fam-avatar {
          width: 50px; height: 50px; border-radius: 50%; overflow: hidden; background: var(--marigold-tint);
          display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;
        }
        .fam-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .fam-info { flex: 1; margin-left: 6px; }
        .fam-info h4 { margin: 0; font-size: 14.5px; font-weight: 900; color: var(--ink); }
        .fam-info p.rel { margin: 1px 0; font-size: 11.5px; font-weight: 800; color: var(--green); }
        .fam-info p.sub { margin: 0; font-size: 10.5px; font-weight: 700; color: var(--ink-soft); }

        .fam-actions { display: flex; align-items: center; gap: 6px; }
        .vcall-btn {
          background: var(--green); color: #fff; border: none; border-radius: 14px; padding: 9px 12px;
          font-size: 12.5px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 5px;
          text-decoration: none;
        }
        .del-contact-btn {
          background: transparent; border: none; color: var(--ink-soft); font-size: 16px; cursor: pointer; padding: 4px;
        }

        .add-contact-btn {
          width: 100%; border: 2px dashed #B8C7BA; background: var(--white);
          border-radius: 20px; padding: 14px; color: var(--green); font-weight: 900;
          font-size: 13.5px; cursor: pointer; margin-top: 8px; box-sizing: border-box;
        }

        .callout {
          background: var(--marigold-tint); border-left: 4px solid var(--marigold); border-radius: 14px;
          padding: 12px 14px; font-size: 11.5px; color: #7a5015; font-weight: 700; line-height: 1.45; margin-top: 14px;
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.6);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 32px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.25);
        }
        .sheet h3 { margin: 0 0 16px 0; font-family: 'Fraunces', serif; font-size: 19px; color: var(--ink); }
        .form-group { margin-bottom: 11px; }
        .form-group label { display: block; font-size: 11.5px; font-weight: 800; color: var(--ink-soft); margin-bottom: 4px; }
        .form-group select, .form-group input {
          width: 100%; padding: 11px 12px; border-radius: 14px; border: 1.5px solid var(--green-tint);
          background: var(--canvas); font-size: 13.5px; font-family: inherit; font-weight: 700; color: var(--ink); box-sizing: border-box;
        }
        .form-btns { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .submit-btn { background: var(--green); color: #fff; border: none; border-radius: 16px; padding: 14px; font-weight: 900; font-size: 14px; cursor: pointer; }
        .cancel-btn { background: var(--canvas); border: 1.5px solid #C7D3C9; color: var(--ink); border-radius: 16px; padding: 12px; font-weight: 800; font-size: 13px; cursor: pointer; }
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
            <h1>Family Members</h1>
          </div>

          <div className="content">
            <div className="section-label">Your Family Contacts</div>

            {contacts.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '20px', padding: '28px 16px', textAlign: 'center', color: 'var(--ink-soft)', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '38px', marginBottom: '8px' }}>👨‍👩‍👧</div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--ink)' }}>No family members added</h4>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700 }}>Add your loved ones below for direct 1-tap calls.</p>
              </div>
            ) : (
              contacts.map(c => (
                <div key={c.id} className="fam-card">
                  <div className="fam-avatar">
                    {c.avatarUrl ? <img src={c.avatarUrl} alt={c.name} /> : '👤'}
                  </div>
                  <div className="fam-info">
                    <h4>{c.name}</h4>
                    <p className="rel">{c.relation}</p>
                    <p className="sub">{c.availability}</p>
                  </div>
                  <div className="fam-actions">
                    <a href={`tel:${c.phone}`} className="vcall-btn">
                      📹 Call
                    </a>
                    <button className="del-contact-btn" onClick={() => handleDeleteContact(c.id)} title="Delete Contact">
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}

            <button className="add-contact-btn" onClick={() => setShowAddModal(true)}>
              + Add Family Contact
            </button>

            <div className="callout">
              Tap the call button to connect with your family members instantly.
            </div>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <h3>Add Family Member</h3>
            <form onSubmit={handleAddContact}>
              <div className="form-group">
                <label>Member Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya / Rahul"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Relationship</label>
                <select value={newRelation} onChange={e => setNewRelation(e.target.value)}>
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Friend">Friend</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Usually free in the evening"
                  value={newAvailability}
                  onChange={e => setNewAvailability(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Photo (Optional)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1.5px dashed var(--green)', background: 'var(--canvas)', fontWeight: 800, cursor: 'pointer' }}
                >
                  {newAvatar ? '✓ Photo Selected' : '📷 Upload Photo'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>

              <div className="form-btns">
                <button type="submit" className="submit-btn">Save Member</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}