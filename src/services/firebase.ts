import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// These values come from YOUR Firebase project settings.
// Create a project at https://console.firebase.google.com, then paste your
// real config here (or better: load from environment variables — see .env.example).
// Do NOT commit real keys to a public repo.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Enables offline reads/writes — this is what satisfies the PS's
// "offline-first" requirement without hand-rolled SQLite sync logic.
enableIndexedDbPersistence(db).catch((err) => {
  // Fails if multiple tabs are open, or browser doesn't support it — log, don't crash.
  console.warn('Firestore offline persistence not enabled:', err.code)
})
