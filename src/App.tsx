import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import CareProvider from './providers/CareProvider';
import CheckInOverlay from './components/CheckInOverlay';
import PatientMicChat from './pages/patient/mic_chat';
import GuideProvider from './guide/GuideProvider';

// Patient stack
import PatientHomePage from './pages/patient/HomePage';
import ActivitiesPage from './pages/patient/ActivitiesPage';
import GamesHubPage from './pages/patient/GamesHubPage';
import IdentifyPicture from './pages/patient/games/IdentifyPicture';
import MemoryMatch from './pages/patient/games/MemoryMatch';
import JigsawPuzzle from './pages/patient/games/JigsawPuzzle';
import ButtonSorting from './pages/patient/games/ButtonSorting';
import RemindersPage from './pages/patient/RemindersPage';
import VideosLibraryPage from './pages/patient/VideosLibraryPage';
import YogaPage from './pages/patient/YogaPage';
import FamilyEmergencyPage from './pages/patient/FamilyEmergencyPage';
import EmergencyPage from './pages/patient/EmergencyPage' ;
import PatientChatThreadPage from './pages/patient/ChatPage';
import PatientAnalyticsPage from './pages/patient/AnalyticsPage';
import PatientAppointmentsPage from './pages/patient/AppointmentsPage';
import PatientSettingsPage from './pages/patient/SettingsPage';

// Doctor stack
import DoctorHomePage from './pages/doctor/HomePage';
import DoctorSearchPage from './pages/doctor/SearchPage';
import PatientsListPage from './pages/doctor/PatientsListPage';
import PatientProfilePage from './pages/doctor/PatientProfilePage';
import AnalyticsHubPage from './pages/doctor/AnalyticsHubPage';
import AnalyticsDetailPage from './pages/doctor/AnalyticsDetailPage';
import AppointmentsCalendarPage from './pages/doctor/AppointmentsCalendarPage';
import AppointmentsTodayPage from './pages/doctor/AppointmentsTodayPage';
import PendingRequestsPage from './pages/doctor/PendingRequestsPage';
import AppointmentDetailPage from './pages/doctor/AppointmentDetailPage';
import DoctorChatListPage from './pages/doctor/ChatListPage';
import DoctorChatThreadPage from './pages/doctor/ChatThreadPage';
import NotificationsPage from './pages/doctor/NotificationsPage';
import SettingsPage from './pages/doctor/SettingsPage';
import QuickConnectPage from './pages/doctor/QuickConnectPage';
import PrescriptionManager from './pages/doctor/PrescriptionManager';

function DoctorMobileFrame() {
  return (
    <div className="doctor-mobile-root">
      <div className="doctor-mobile-phone">
        <div className="doctor-mobile-screen">
          <div className="doctor-mobile-notch" />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  return (
    <>
      <LanguageSwitcher />
      <div className="patient-global-mic-layer">
        <PatientMicChat />
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ---------------- PATIENT STACK ---------------- */}
        <Route path="/patient" element={<PatientHomePage />} />

        {/* Cognitive Games */}
        <Route path="/patient/activities" element={<ActivitiesPage />} />
        <Route path="/patient/games" element={<GamesHubPage />} />
        <Route path="/patient/games/identify-picture" element={<IdentifyPicture />} />
        <Route path="/patient/games/memory-match" element={<MemoryMatch />} />
        <Route path="/patient/games/jigsaw" element={<JigsawPuzzle />} />
        <Route path="/patient/games/button-sorting" element={<ButtonSorting />} />

        {/* Routine, Yoga & Media */}
        <Route path="/patient/reminders" element={<RemindersPage />} />
        <Route path="/patient/videos-library" element={<VideosLibraryPage />} />
        <Route path="/patient/yoga" element={<YogaPage />} />

        {/* Dedicated Family & Emergency Routes */}
        <Route path="/patient/family" element={<FamilyEmergencyPage />} />
        <Route path="/patient/emergency" element={<EmergencyPage />} />
        <Route path="/patient/family-emergency" element={<Navigate to="/patient/family" replace />} />

        <Route path="/patient/chat" element={<PatientChatThreadPage />} />
        <Route path="/patient/analytics" element={<PatientAnalyticsPage />} />
        <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
        <Route path="/patient/settings" element={<PatientSettingsPage />} />

        {/* ---------------- DOCTOR STACK ---------------- */}
        <Route element={<DoctorMobileFrame />}>
          <Route path="/doctor" element={<DoctorHomePage />} />
          <Route path="/doctor/notifications" element={<NotificationsPage />} />
          <Route path="/doctor/settings" element={<SettingsPage />} />
          <Route path="/doctor/call" element={<QuickConnectPage />} />
          <Route path="/doctor/search" element={<DoctorSearchPage />} />
          <Route path="/doctor/patients" element={<PatientsListPage />} />
          <Route path="/doctor/patients/:patientId" element={<PatientProfilePage />} />
          <Route path="/doctor/patients/:patientId/prescriptions" element={<PrescriptionManager />} />

          <Route path="/doctor/analytics" element={<AnalyticsHubPage />} />
          <Route path="/doctor/analytics/:patientId" element={<AnalyticsDetailPage />} />

          <Route path="/doctor/appointments" element={<AppointmentsCalendarPage />} />
          <Route path="/doctor/appointments/today" element={<AppointmentsTodayPage />} />
          <Route path="/doctor/appointments/pending" element={<PendingRequestsPage />} />
          <Route path="/doctor/appointments/:appointmentId" element={<AppointmentDetailPage />} />

          <Route path="/doctor/chat" element={<DoctorChatListPage />} />
          <Route path="/doctor/chat/:threadId" element={<DoctorChatThreadPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <CheckInOverlay />
    </>
  );
}

export default function App() {
  return (
    <CareProvider>
      <BrowserRouter>
        <GuideProvider>
          <AppShell />
        </GuideProvider>
      </BrowserRouter>
    </CareProvider>
  );
}