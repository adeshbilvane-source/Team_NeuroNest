import { Mic, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type RecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((event: RecognitionEvent) => void) | null
}
type RecognitionConstructor = new () => Recognition

type Command = { phrases: string[]; path: string; label: string }

const COMMANDS: Command[] = [
  { phrases: ['home', 'go home', 'main page'], path: '/patient', label: 'home' },
  { phrases: ['games', 'play a game', 'play game'], path: '/patient/games', label: 'games' },
  { phrases: ['reminders', 'my reminders', 'medicine reminders'], path: '/patient/reminders', label: 'reminders' },
  { phrases: ['yoga', 'exercise'], path: '/patient/yoga', label: 'yoga' },
  { phrases: ['videos', 'video library', 'my videos'], path: '/patient/videos-library', label: 'videos' },
  { phrases: ['family', 'family and emergency', 'emergency'], path: '/patient/family-emergency', label: 'family and emergency' },
  { phrases: ['help', 'chat', 'talk to doctor'], path: '/patient/chat', label: 'chat' },
  { phrases: ['analytics', 'my progress', 'progress'], path: '/patient/analytics', label: 'analytics' },
  { phrases: ['appointments', 'my appointments', 'book appointment'], path: '/patient/appointments', label: 'appointments' },
  { phrases: ['patients', 'patient list'], path: '/doctor/patients', label: 'patients' },
  { phrases: ['doctor analytics', 'patient analytics'], path: '/doctor/analytics', label: 'patient analytics' },
  { phrases: ['doctor appointments', 'appointment calendar'], path: '/doctor/appointments', label: 'appointments' },
  { phrases: ['quick connect', 'call a patient', 'make a call'], path: '/doctor/call', label: 'quick connect' },
  { phrases: ['notifications', 'my notifications'], path: '/doctor/notifications', label: 'notifications' },
  { phrases: ['settings', 'app settings'], path: '/doctor/settings', label: 'settings' },
]

function getRecognition(): RecognitionConstructor | null {
  const browserWindow = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null
}

function speak(message: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = (localStorage.getItem('sahayak_language') || 'en') === 'hi' ? 'hi-IN' : 'en-IN'
  utterance.rate = 0.92
  utterance.pitch = 1.02
  window.speechSynthesis.speak(utterance)
}

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').replace(/\b(\d+)\b/g, '$1').trim()
}

export default function VoiceAssistant() {
  const navigate = useNavigate()
  const location = useLocation()
  const recognitionRef = useRef<Recognition | null>(null)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [message, setMessage] = useState('Say “help” to hear what I can do.')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSupported(Boolean(getRecognition()))
    const isAppRoute = location.pathname.startsWith('/patient') || location.pathname.startsWith('/doctor')
    const tutorialKey = isAppRoute ? 'sahayak_voice_app_tutorial' : location.pathname === '/login' ? 'sahayak_voice_login_tutorial' : ''
    const hasStarted = tutorialKey ? sessionStorage.getItem(tutorialKey) === 'yes' : true
    if (!hasStarted) {
      sessionStorage.setItem(tutorialKey, 'yes')
      const role = location.pathname.startsWith('/doctor') ? 'caregiver' : 'patient'
      const tutorial = location.pathname === '/login'
        ? 'Welcome to Sahayak. Choose Patient or Caregiver, or say click login as patient. After signing in, tap Speak whenever you need help.'
        : role === 'patient'
        ? 'Welcome to Sahayak. You can say: play a game, open reminders, show my appointments, call my family, or help. Tap the microphone whenever you want to speak.'
        : 'Welcome to Sahayak. You can say: open patients, show analytics, open appointments, quick connect, notifications, settings, or help. Tap the microphone whenever you want to speak.'
      setOpen(true)
      setMessage(tutorial)
      speak(tutorial)
    }
    return undefined
  }, [location.pathname])

  useEffect(() => () => {
    recognitionRef.current?.stop()
    window.speechSynthesis?.cancel()
  }, [])

  const respond = (text: string) => {
    setMessage(text)
    speak(text)
  }

  const readCurrentPage = () => {
    const mainText = Array.from(document.querySelectorAll('h1, h2, h3, p, button, [role="status"]'))
      .map((element) => cleanText(element.textContent || ''))
      .filter(Boolean)
      .slice(0, 12)
      .join('. ')
    respond(mainText ? `Here is this page. ${mainText}` : 'This page is ready. Say help for available actions.')
  }

  const clickVisibleControl = (spoken: string) => {
    const wanted = spoken.replace(/^(click|press|open|select|choose)\s+/, '').trim()
    const controls = Array.from(document.querySelectorAll('button, a, [role="button"]'))
    const match = controls.find((control) => cleanText(control.textContent || control.getAttribute('aria-label') || '').toLowerCase().includes(wanted))
    if (match) {
      ;(match as HTMLElement).click()
      respond(`Done. I selected ${wanted}.`)
      return true
    }
    return false
  }

  const handleCommand = (rawTranscript: string) => {
    const transcript = rawTranscript.toLowerCase().trim()
    const isDoctor = location.pathname.startsWith('/doctor')
    setMessage(`I heard: “${rawTranscript}”`)

    if (transcript.includes('help') || transcript.includes('what can you do')) {
      respond('You can say open games, reminders, appointments, family, analytics, settings, or notifications. You can also say click a button, read this page, go back, or log out.')
      return
    }
    if (transcript.includes('read this') || transcript.includes('read page') || transcript.includes('what is on this page')) {
      readCurrentPage()
      return
    }
    if (transcript.includes('go back') || transcript === 'back') {
      window.history.back()
      respond('Going back.')
      return
    }
    if (transcript === 'home' || transcript === 'go home' || transcript === 'main page') {
      navigate(isDoctor ? '/doctor' : '/patient')
      respond('Going to your home page.')
      return
    }
    if (transcript.includes('log out') || transcript.includes('logout')) {
      localStorage.removeItem('sahayak_current_user')
      navigate('/login')
      respond('You are logged out. I am taking you to the login page.')
      return
    }
    if (transcript.startsWith('type ') || transcript.startsWith('enter ')) {
      const value = rawTranscript.replace(/^(type|enter)\s+/i, '').trim()
      const input = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement
        ? document.activeElement
        : document.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="file"]), textarea')
      if (input && value) {
        const setter = Object.getOwnPropertyDescriptor(input instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype, 'value')?.set
        setter?.call(input, value)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        respond(`I entered ${value}.`)
      } else {
        respond('Please tap the field you want me to fill, then say type followed by the words.')
      }
      return
    }
    if (transcript.startsWith('click ') || transcript.startsWith('press ') || transcript.startsWith('select ')) {
      if (!clickVisibleControl(transcript)) respond(`I could not find a button called ${transcript.replace(/^(click|press|select)\s+/, '')}.`)
      return
    }
    const command = COMMANDS.find((item) => {
      if (isDoctor && item.path.startsWith('/patient')) return false
      if (!isDoctor && item.path.startsWith('/doctor')) return false
      return item.phrases.some((phrase) => transcript.includes(phrase))
    })
    if (command) {
      navigate(command.path)
      respond(`Opening ${command.label}.`)
      return
    }
    respond('I did not understand that yet. Say help to hear examples, or say click followed by the button name.')
  }

  const startListening = () => {
    const Recognition = getRecognition()
    if (!Recognition) {
      setSupported(false)
      respond('Voice recognition is not available in this browser. Please use Chrome or Edge, then allow microphone access.')
      return
    }
    recognitionRef.current?.stop()
    const recognition = new Recognition()
    recognition.lang = (localStorage.getItem('sahayak_language') || 'en') === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => { setListening(true); setOpen(true); setMessage('Listening. Take your time.') }
    recognition.onresult = (event) => handleCommand(event.results[0][0].transcript)
    recognition.onerror = () => { setListening(false); respond('I could not hear that. Please try again when you are ready.') }
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <div className="voice-assistant">
      {open && (
        <div className="voice-assistant-card" role="status" aria-live="polite">
          <div className="voice-assistant-card-top"><Volume2 size={16} /><strong>Sahayak voice assistant</strong><button type="button" onClick={() => setOpen(false)} aria-label="Close voice assistant"><X size={15} /></button></div>
          <p>{message}</p>
          {!supported && <small>Voice recognition needs Chrome or Edge microphone support.</small>}
        </div>
      )}
      <button type="button" className={`voice-assistant-button ${listening ? 'is-listening' : ''}`} onClick={startListening} aria-label={listening ? 'Listening' : 'Start voice assistant'} title="Speak to Sahayak">
        <Mic size={22} />
        <span>{listening ? 'Listening' : 'Speak'}</span>
      </button>
    </div>
  )
}
