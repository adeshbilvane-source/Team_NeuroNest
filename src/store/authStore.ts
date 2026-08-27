import { create } from 'zustand'
import type { UserProfile } from '../types'

interface AuthState {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  logout: () => void
}

// NOTE: this is a placeholder in-memory store.
// Real auth wiring happens in src/services/authService.ts once Firebase is connected.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
