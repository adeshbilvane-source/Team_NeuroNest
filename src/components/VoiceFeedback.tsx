import { useEffect, useRef } from 'react'
import { subscribeVoiceStatus } from '../services/VoiceService'
import { showToast } from './Toast'

export default function VoiceFeedback() {
  const hasShownErrorRef = useRef(false)

  useEffect(() => {
    const unsubscribe = subscribeVoiceStatus((status) => {
      if (status.phase === 'error' && status.text === 'Speech recognition not supported in this browser' && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true
        showToast('Speech recognition not supported in this browser', 'info')
        setTimeout(() => {
          hasShownErrorRef.current = false
        }, 5000)
      }
    })

    return unsubscribe
  }, [])

  return null
}
