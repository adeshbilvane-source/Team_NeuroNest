export type UserRole = 'patient' | 'doctor' | 'family'

export interface UserProfile {
  id: string
  role: UserRole
  name: string
  languagePreference: string
}

export interface Reminder {
  id: string
  patientId: string
  type: 'medicine' | 'daily' | 'appointment' | 'water'
  title: string
  timeISO: string
  done: boolean
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
  reason: string
  scheduledTimeISO: string | null
}

export interface GameScore {
  id: string
  patientId: string
  gameType: 'identify-picture' | 'memory-match' | 'jigsaw' | 'button-sorting'
  category: string
  score: number
  difficultyLevel: number
  playedAtISO: string
}

export interface ChatMessage {
  id: string
  threadId: string
  senderId: string
  text: string
  sentAtISO: string
}
