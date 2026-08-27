import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AppDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone: string;
  isOnline: boolean;
}

interface FamilyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  availability: string;
}

export default function EmergencyPage() {
  const navigate = useNavigate();

  const [doctorsList, setDoctorsList] = useState<AppDoctor[]>(() => {
    const raw = localStorage.getItem('sahayak_registered_doctors');
    return raw ? JSON.parse(raw) : [];
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(() => {
    return localStorage.getItem('sahayak_primary_doctor_id') || '';
  });

  const [familyList, setFamilyList] = useState<FamilyContact[]>(() => {
    const raw = localStorage.getItem('sahayak_family_contacts');
    return raw ? JSON.parse(raw) : [];
  });
  const [primaryGuardianId, setPrimaryGuardianId] = useState<string>(() => {
    return localStorage.getItem('sahayak_primary_guardian_id') || '';
  });

  const [showDoctorModal, setShowDoctorModal] = useState<boolean>(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState<boolean>(false);
  const [showGuardianModal, setShowGuardianModal] = useState<boolean>(false);

  const [docName, setDocName] = useState<string>('');
  const [docSpecialty, setDocSpecialty] = useState<string>('Neurologist & Geriatrician');
  const [docHospital, setDocHospital] = useState<string>('');
  const [docPhone, setDocPhone] = useState<string>('');

  useEffect(() => {
    if (!selectedDoctorId && doctorsList.length > 0) {
      setSelectedDoctorId(doctorsList[0].id);
      localStorage.setItem('sahayak_primary_doctor_id', doctorsList[0].id);
    }
  }, [doctorsList]);

  useEffect(() => {
    if (!primaryGuardianId && familyList.length > 0) {
      setPrimaryGuardianId(familyList[0].id);
      localStorage.setItem('sahayak_primary_guardian_id', familyList[0].id);
    }
  }, [familyList]);

  const activeDoctor = doctorsList.find(d => d.id === selectedDoctorId) || doctorsList[0] || null;
  const activeGuardian = familyList.find(f => f.id === primaryGuardianId) || familyList[0] || null;

  const handleSelectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    localStorage.setItem('sahayak_primary_doctor_id', id);
    setShowDoctorModal(false);
  };

  const handleSelectGuardian = (id: string) => {
    setPrimaryGuardianId(id);
    localStorage.setItem('sahayak_primary_guardian_id', id);
    setShowGuardianModal(false);
  };

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docPhone.trim()) return;

    const newDoc: AppDoctor = {
      id: 'doc-' + Date.now(),
      name: docName.startsWith('Dr.') ? docName.trim() : `Dr. ${docName.trim()}`,
      specialty: docSpecialty.trim() || 'General Specialist',
      hospital: docHospital.trim() || 'Sahayak Health Network',
      phone: docPhone.trim(),
      isOnline: true
    };

    const updated = [...doctorsList, newDoc];
    setDoctorsList(updated);
    localStorage.setItem('sahayak_registered_doctors', JSON.stringify(updated));
    setSelectedDoctorId(newDoc.id);
    localStorage.setItem('sahayak_primary_doctor_id', newDoc.id);

    setDocName('');
    setDocPhone('');
    setDocHospital('');
    setShowAddDoctorModal(false);
  };

  const handleSOSPress = () => {
    if (activeGuardian) {
      window.location.href = `tel:${activeGuardian.phone}`;
    } else if (activeDoctor) {
      window.location.href = `tel:${activeDoctor.phone}`;
    } else {
      window.location.href = 'tel:112';
    }
  };

  return (
    <div className="emer-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --red-tint: #FBE8E6; --red-dark: #8E2319;
          --blue: #3E7FB8; --blue-tint: #E1EDF6;
        }
        .emer-root-container {
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
        .page-header h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 20px; color: var(--red); margin: 0; }
        .content { flex: 1; overflow-y: auto; padding: 16px 18px 26px 18px; }

        .section-label {
          font-size: 11.5px; font-weight: 900; color: var(--ink-soft);
          text-transform: uppercase; letter-spacing: 0.6px; margin: 14px 0 8px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .section-link { color: var(--blue); font-size: 11.5px; font-weight: 800; cursor: pointer; text-transform: none; }

        .sos-big-card {
          background: linear-gradient(135deg, var(--red) 0%, var(--red-dark) 100%);
          border-radius: 26px; padding: 22px 18px; text-align: center; color: #fff;
          box-shadow: 0 12px 28px rgba(179,63,51,0.4); margin-bottom: 16px; cursor: pointer;
          border: 3px solid rgba(255,255,255,0.25); transition: transform 0.15s ease;
        }
        .sos-big-card:active { transform: scale(0.97); }
        .sos-icon { font-size: 42px; margin-bottom: 4px; }
        .sos-big-card h2 { margin: 0 0 4px; font-family: 'Fraunces', serif; font-size: 23px; font-weight: 900; }
        .sos-big-card p { margin: 0; font-size: 12px; font-weight: 700; opacity: 0.95; }

        .emer-card {
          background: var(--white); border-radius: 20px; padding: 14px 16px; box-shadow: var(--shadow);
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
        }
        .emer-left { display: flex; align-items: center; gap: 12px; }
        .emer-ic { width: 44px; height: 44px; border-radius: 14px; background: var(--red-tint); display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .emer-ic.doc { background: var(--blue-tint); }
        .emer-ic.fam { background: var(--green-tint); }
        .emer-left h4 { margin: 0; font-size: 14px; font-weight: 900; color: var(--ink); }
        .emer-left p { margin: 2px 0 0; font-size: 11.5px; font-weight: 700; color: var(--ink-soft); }

        .call-btn {
          background: var(--red); color: #fff; border: none; border-radius: 14px; padding: 10px 16px;
          font-size: 13px; font-weight: 900; cursor: pointer; text-decoration: none;
        }
        .call-btn.doc { background: var(--blue); }
        .call-btn.fam { background: var(--green); }

        .empty-dash-box {
          background: var(--white); border: 1.5px dashed #B8C7BA; border-radius: 18px;
          padding: 14px; cursor: pointer; margin-bottom: 10px;
        }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.6);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 32px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.25);
          max-height: 85vh; overflow-y: auto;
        }
        .select-row {
          border: 2px solid var(--canvas); background: var(--canvas); border-radius: 16px;
          padding: 12px; margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
        }
        .select-row.active { border-color: var(--green); background: var(--green-tint); }
        .select-row.active.doc { border-color: var(--blue); background: var(--blue-tint); }
        .cancel-btn { background: var(--canvas); border: 1.5px solid #C7D3C9; color: var(--ink); border-radius: 16px; padding: 12px; font-weight: 800; font-size: 13px; cursor: pointer; width: 100%; margin-top: 10px; }
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
            <h1>🚨 Emergency SOS</h1>
          </div>

          <div className="content">
            <div className="sos-big-card" onClick={handleSOSPress}>
              <div className="sos-icon">🆘</div>
              <h2>Tap for Emergency SOS</h2>
              <p>
                {activeGuardian
                  ? `Direct call to Family: ${activeGuardian.name} (${activeGuardian.relation})`
                  : activeDoctor
                  ? `Direct call to Physician: ${activeDoctor.name}`
                  : 'Dialing National Emergency Services (112)'}
              </p>
            </div>

            <div className="section-label">
              <span>Emergency Family Member</span>
              <span className="section-link" onClick={() => setShowGuardianModal(true)}>
                {familyList.length > 0 ? 'Change Member ❯' : '+ Link Member'}
              </span>
            </div>

            {activeGuardian ? (
              <div className="emer-card">
                <div className="emer-left">
                  <div className="emer-ic fam">👨‍👩‍👧</div>
                  <div>
                    <h4>{activeGuardian.name} ({activeGuardian.relation})</h4>
                    <p>{activeGuardian.phone}</p>
                  </div>
                </div>
                <a href={`tel:${activeGuardian.phone}`} className="call-btn fam">
                  Call
                </a>
              </div>
            ) : (
              <div className="empty-dash-box" onClick={() => navigate('/patient/family')}>
                <h4 style={{ margin: 0, fontSize: 13.5, color: 'var(--green)' }}>+ Select Family Member for SOS</h4>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-soft)' }}>
                  Add a family member to receive emergency calls.
                </p>
              </div>
            )}

            <div className="section-label" style={{ marginTop: 16 }}>
              <span>Assigned App Doctor</span>
              <span className="section-link" onClick={() => setShowDoctorModal(true)}>
                {doctorsList.length > 0 ? 'Change Doctor ❯' : '+ Link Doctor'}
              </span>
            </div>

            {activeDoctor ? (
              <div className="emer-card">
                <div className="emer-left">
                  <div className="emer-ic doc">🩺</div>
                  <div>
                    <h4>{activeDoctor.name}</h4>
                    <p>{activeDoctor.specialty}</p>
                  </div>
                </div>
                <a href={`tel:${activeDoctor.phone}`} className="call-btn doc">
                  Call Dr.
                </a>
              </div>
            ) : (
              <div className="empty-dash-box" onClick={() => setShowAddDoctorModal(true)}>
                <h4 style={{ margin: 0, fontSize: 13.5, color: 'var(--blue)' }}>+ Link App Registered Doctor</h4>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-soft)' }}>
                  Assign your treating doctor for emergency tele-consultation.
                </p>
              </div>
            )}

            <div className="section-label" style={{ marginTop: 16 }}>
              <span>National Services</span>
            </div>

            <div className="emer-card">
              <div className="emer-left">
                <div className="emer-ic">🚑</div>
                <div>
                  <h4>Ambulance</h4>
                  <p>Immediate medical response (108)</p>
                </div>
              </div>
              <a href="tel:108" className="call-btn">Call</a>
            </div>

            <div className="emer-card">
              <div className="emer-left">
                <div className="emer-ic">👮</div>
                <div>
                  <h4>Police Helpline</h4>
                  <p>Emergency police patrol (100)</p>
                </div>
              </div>
              <a href="tel:100" className="call-btn">Call</a>
            </div>
          </div>
        </div>
      </div>

      {showGuardianModal && (
        <div className="modal-overlay" onClick={() => setShowGuardianModal(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--ink)' }}>Choose Emergency Family Member</h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>
              Select which family contact gets dialed first when SOS is pressed.
            </p>

            {familyList.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center', padding: '14px 0' }}>
                No family members in list. Please add members from Family page.
              </p>
            ) : (
              familyList.map(fam => (
                <div
                  key={fam.id}
                  className={`select-row ${fam.id === primaryGuardianId ? 'active' : ''}`}
                  onClick={() => handleSelectGuardian(fam.id)}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, color: 'var(--ink)' }}>{fam.name} ({fam.relation})</h4>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-soft)' }}>{fam.phone}</p>
                  </div>
                  {fam.id === primaryGuardianId && (
                    <span style={{ color: 'var(--green)', fontWeight: 900, fontSize: 14 }}>✓ Primary</span>
                  )}
                </div>
              ))
            )}

            <button className="cancel-btn" onClick={() => setShowGuardianModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showDoctorModal && (
        <div className="modal-overlay" onClick={() => setShowDoctorModal(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--ink)' }}>Choose App Doctor</h3>
            <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>
              Select which doctor should be linked to the SOS card.
            </p>

            {doctorsList.map(doc => (
              <div
                key={doc.id}
                className={`select-row doc ${doc.id === selectedDoctorId ? 'active doc' : ''}`}
                onClick={() => handleSelectDoctor(doc.id)}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, color: 'var(--ink)' }}>{doc.name}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-soft)' }}>{doc.specialty} · {doc.hospital}</p>
                </div>
                {doc.id === selectedDoctorId && (
                  <span style={{ color: 'var(--blue)', fontWeight: 900, fontSize: 14 }}>✓ Assigned</span>
                )}
              </div>
            ))}

            <button
              style={{ width: '100%', padding: 12, borderRadius: 14, border: '1.5px dashed var(--blue)', background: 'var(--canvas)', color: 'var(--blue)', fontWeight: 800, cursor: 'pointer', marginBottom: 8 }}
              onClick={() => {
                setShowDoctorModal(false);
                setShowAddDoctorModal(true);
              }}
            >
              + Link Another Doctor
            </button>

            <button className="cancel-btn" onClick={() => setShowDoctorModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAddDoctorModal && (
        <div className="modal-overlay" onClick={() => setShowAddDoctorModal(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 14px', fontSize: 18 }}>Link New Doctor</h3>
            <form onSubmit={handleAddDoctor}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 4 }}>Doctor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 14, border: '1.5px solid var(--green-tint)', background: 'var(--canvas)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 4 }}>Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Neurologist / Physician"
                  value={docSpecialty}
                  onChange={e => setDocSpecialty(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 14, border: '1.5px solid var(--green-tint)', background: 'var(--canvas)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 4 }}>Hospital / Clinic Name</label>
                <input
                  type="text"
                  placeholder="e.g. City Care Hospital"
                  value={docHospital}
                  onChange={e => setDocHospital(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 14, border: '1.5px solid var(--green-tint)', background: 'var(--canvas)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 4 }}>Emergency Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98000 12345"
                  value={docPhone}
                  onChange={e => setDocPhone(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 14, border: '1.5px solid var(--green-tint)', background: 'var(--canvas)', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button type="submit" style={{ background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 16, padding: 14, fontWeight: 900, cursor: 'pointer' }}>
                  Assign as App Doctor
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddDoctorModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}