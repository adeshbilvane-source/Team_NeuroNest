import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import LoginPage from './pages/auth/LoginPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import Toast from './components/Toast'
import VoiceAssistant from './components/VoiceAssistant'

// Patient stack
import PatientHomePage from './pages/patient/HomePage'
import GamesHubPage from './pages/patient/GamesHubPage'
import IdentifyPicture from './pages/patient/games/IdentifyPicture'
import MemoryMatch from './pages/patient/games/MemoryMatch'
import JigsawPuzzle from './pages/patient/games/JigsawPuzzle'
import ButtonSorting from './pages/patient/games/ButtonSorting'
import RemindersPage from './pages/patient/RemindersPage'
import VideosLibraryPage from './pages/patient/VideosLibraryPage'
import YogaPage from './pages/patient/YogaPage'
import FamilyEmergencyPage from './pages/patient/FamilyEmergencyPage'
import PatientChatThreadPage from './pages/patient/ChatPage'
import PatientAnalyticsPage from './pages/patient/AnalyticsPage'
import PatientAppointmentsPage from './pages/patient/AppointmentsPage'

// Doctor stack
import DoctorHomePage from './pages/doctor/HomePage'
import DoctorSearchPage from './pages/doctor/SearchPage'
import PatientsListPage from './pages/doctor/PatientsListPage'
import PatientProfilePage from './pages/doctor/PatientProfilePage'
import AnalyticsHubPage from './pages/doctor/AnalyticsHubPage'
import AnalyticsDetailPage from './pages/doctor/AnalyticsDetailPage'
import AppointmentsCalendarPage from './pages/doctor/AppointmentsCalendarPage'
import AppointmentsTodayPage from './pages/doctor/AppointmentsTodayPage'
import PendingRequestsPage from './pages/doctor/PendingRequestsPage'
import AppointmentDetailPage from './pages/doctor/AppointmentDetailPage'
import DoctorChatListPage from './pages/doctor/ChatListPage'
import DoctorChatThreadPage from './pages/doctor/ChatThreadPage'
import QuickConnectPage from './pages/doctor/QuickConnectPage'
import SettingsPage from './pages/doctor/SettingsPage'
import NotificationsPage from './pages/doctor/NotificationsPage'

function DoctorMobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="doctor-mobile-root">
      <div className="doctor-mobile-phone">
        <div className="doctor-mobile-screen">
          <div className="doctor-mobile-notch" />
          {children}
        </div>
      </div>
    </div>
  )
}

function DoctorPage({ children }: { children: ReactNode }) {
  return <DoctorMobileFrame>{children}</DoctorMobileFrame>
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageSwitcher />
      <Toast />
      <VoiceAssistant />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ---------------- PATIENT STACK ---------------- */}
        <Route path="/patient" element={<PatientHomePage />} />

        {/* games.html was one hub + 4 internal JS panels; split into real routes
            so browser back/forward and deep-linking work correctly */}
        <Route path="/patient/games" element={<GamesHubPage />} />
        <Route path="/patient/games/identify-picture" element={<IdentifyPicture />} />
        <Route path="/patient/games/memory-match" element={<MemoryMatch />} />
        <Route path="/patient/games/jigsaw" element={<JigsawPuzzle />} />
        <Route path="/patient/games/button-sorting" element={<ButtonSorting />} />

        <Route path="/patient/reminders" element={<RemindersPage />} />
        <Route path="/patient/videos-library" element={<VideosLibraryPage />} />
        <Route path="/patient/yoga" element={<YogaPage />} />
        <Route path="/patient/family-emergency" element={<FamilyEmergencyPage />} />
        <Route path="/patient/chat" element={<PatientChatThreadPage />} />

        {/* NOT YET DESIGNED — no mockup exists for either of these two */}
        <Route path="/patient/analytics" element={<PatientAnalyticsPage />} />
        <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />

        {/* ---------------- DOCTOR STACK ---------------- */}
        <Route path="/doctor" element={<DoctorPage><DoctorHomePage /></DoctorPage>} />
        <Route path="/doctor/search" element={<DoctorPage><DoctorSearchPage /></DoctorPage>} />

        <Route path="/doctor/patients" element={<DoctorPage><PatientsListPage /></DoctorPage>} />
        <Route path="/doctor/patients/:patientId" element={<DoctorPage><PatientProfilePage /></DoctorPage>} />

        {/* ORPHANED — nothing on Home links here yet. Kept as its own route
            rather than merged into /patients, since we don't know if
            doctor_analytics_detail_mockup.html was meant to unify them. */}
        <Route path="/doctor/analytics" element={<DoctorPage><AnalyticsHubPage /></DoctorPage>} />
        <Route path="/doctor/analytics/:patientId" element={<DoctorPage><AnalyticsDetailPage /></DoctorPage>} />

        <Route path="/doctor/appointments" element={<DoctorPage><AppointmentsCalendarPage /></DoctorPage>} />
        <Route path="/doctor/appointments/today" element={<DoctorPage><AppointmentsTodayPage /></DoctorPage>} />
        <Route path="/doctor/appointments/pending" element={<DoctorPage><PendingRequestsPage /></DoctorPage>} />
        <Route path="/doctor/appointments/:appointmentId" element={<DoctorPage><AppointmentDetailPage /></DoctorPage>} />

        <Route path="/doctor/chat" element={<DoctorPage><DoctorChatListPage /></DoctorPage>} />
        <Route path="/doctor/chat/:threadId" element={<DoctorPage><DoctorChatThreadPage /></DoctorPage>} />
        <Route path="/doctor/call" element={<DoctorPage><QuickConnectPage /></DoctorPage>} />
        <Route path="/doctor/settings" element={<DoctorPage><SettingsPage /></DoctorPage>} />
        <Route path="/doctor/notifications" element={<DoctorPage><NotificationsPage /></DoctorPage>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
