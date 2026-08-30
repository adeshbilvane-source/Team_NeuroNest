import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../components/Toast';

interface Appointment {
  id: string;
  doctorName: string;
  role: string;
  date: string;
  time: string;
  reason: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export default function PatientAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [doctorName, setDoctorName] = useState<string>('Dr. Sharma (Family Doctor)');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [reason, setReason] = useState<string>('Regular Check-up');

  // Load existing appointments from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('sahayak_appointments');
    if (raw) {
      setAppointments(JSON.parse(raw));
    } else {
      // Default Initial Demo Appointment
      const initial: Appointment[] = [
        {
          id: 'apt-1',
          doctorName: 'Dr. Sharma',
          role: 'Family Doctor',
          date: 'Fri, 28 Aug',
          time: '10:30 AM',
          reason: 'Blood Pressure & Memory Review',
          status: 'Confirmed'
        }
      ];
      setAppointments(initial);
      localStorage.setItem('sahayak_appointments', JSON.stringify(initial));
    }
  }, []);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      showToast("Please select a date!", "info");
      return;
    }

    const newApt: Appointment = {
      id: 'apt-' + Date.now(),
      doctorName: doctorName.split('(')[0].trim(),
      role: doctorName.includes('Nurse') ? 'Home Nurse' : 'Specialist / Doctor',
      date: selectedDate,
      time: selectedTime,
      reason: reason.trim() || 'General Consultation',
      status: 'Pending'
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    localStorage.setItem('sahayak_appointments', JSON.stringify(updated));

    showToast("Appointment booked! Waiting for confirmation.", "success");
    setShowModal(false);
    setSelectedDate('');
  };

  return (
    <div className="apt-root-container">
      <style>{`
        :root {
          --canvas: #F3F6F0; --ink: #24322A; --ink-soft: #5B6A61;
          --green: #3F6B4F; --green-tint: #E3EDE5; --green-dark: #2E5140;
          --marigold: #D98A2B; --marigold-tint: #FBEEDA;
          --white: #FFFFFF; --shadow: 0 6px 16px rgba(36,50,42,0.08);
          --red: #B33F33; --blue: #3E7FB8; --blue-tint: #E1EDF6;
        }
        .apt-root-container {
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

        .book-hero-card {
          background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
          border-radius: 20px; padding: 18px; color: #fff; box-shadow: 0 10px 22px rgba(63,107,79,0.35);
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
        }
        .book-hero-card .copy .t1 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #CFE3D6; letter-spacing: 0.5px; }
        .book-hero-card .copy .t2 { font-size: 16px; font-weight: 900; margin-top: 2px; }
        .req-btn {
          background: var(--marigold); color: #fff; border: none; border-radius: 14px;
          padding: 10px 16px; font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: var(--shadow);
        }

        .section-label { margin: 0 0 12px 0; font-size: 12px; font-weight: 900; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; }

        .apt-card {
          background: var(--white); border-radius: 18px; padding: 14px 16px;
          margin-bottom: 12px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 8px;
        }
        .apt-top { display: flex; justify-content: space-between; align-items: center; }
        .apt-who { display: flex; align-items: center; gap: 10px; }
        .apt-icon { width: 38px; height: 38px; border-radius: 12px; background: var(--green-tint); display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .apt-name { font-size: 14.5px; font-weight: 800; color: var(--ink); }
        .apt-role { font-size: 11px; font-weight: 700; color: var(--ink-soft); }

        .status-badge {
          font-size: 10.5px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px;
        }
        .status-badge.Confirmed { background: var(--green-tint); color: var(--green-dark); }
        .status-badge.Pending { background: var(--marigold-tint); color: #8A5A1C; }

        .apt-details {
          background: var(--canvas); border-radius: 12px; padding: 10px 12px;
          display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: var(--ink);
        }

        /* Booking Modal Sheet */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(36,50,42,0.45);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100;
        }
        .sheet {
          width: 100%; max-width: 390px; background: var(--white); border-radius: 30px 30px 0 0;
          padding: 24px 20px 30px 20px; box-sizing: border-box; box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
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
            <h1>Appointments</h1>
          </div>

          <div className="content">
            {/* Action Banner */}
            <div className="book-hero-card">
              <div className="copy">
                <div className="t1">Need a consultation?</div>
                <div className="t2">Request Doctor Visit</div>
              </div>
              <button className="req-btn" onClick={() => setShowModal(true)}>+ Book Slot</button>
            </div>

            <div className="section-label">Your Scheduled Visits</div>

            {appointments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '20px', fontWeight: 700 }}>
                No active appointment requests. Tap "+ Book Slot" to request one.
              </p>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="apt-card">
                  <div className="apt-top">
                    <div className="apt-who">
                      <div className="apt-icon">{apt.role.includes('Nurse') ? '💉' : '🩺'}</div>
                      <div>
                        <div className="apt-name">{apt.doctorName}</div>
                        <div className="apt-role">{apt.role}</div>
                      </div>
                    </div>
                    <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                  </div>

                  <div className="apt-details">
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.time}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 700 }}>
                    Reason: {apt.reason}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="sheet" onClick={(e) => e.stopPropagation()}>
                <h3>Request an Appointment</h3>
                <form onSubmit={handleBookAppointment}>
                  <div className="form-group">
                    <label>Select Caregiver / Doctor</label>
                    <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
                      <option value="Dr. Sharma (Family Doctor)">Dr. Sharma (Family Doctor)</option>
                      <option value="Nurse Anjali (Home Nurse)">Nurse Anjali (Home Nurse)</option>
                      <option value="Dr. Verma (Neurologist)">Dr. Verma (Neurologist)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Preferred Time Slot</label>
                    <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Reason / Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Regular BP checkup or Headache"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="form-btns">
                    <button type="submit" className="submit-btn">Send Booking Request</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}