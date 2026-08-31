import { getVoiceLocale } from '../i18n/voiceLocale';

const voiceStatusListeners = new Set();

function publishVoiceStatus(status) {
  voiceStatusListeners.forEach((listener) => listener(status));
}

export function subscribeVoiceStatus(listener) {
  voiceStatusListeners.add(listener);
  return () => {
    voiceStatusListeners.delete(listener);
  };
}

export function setVoiceStatus(status) {
  publishVoiceStatus(status);
}

export function speak(text, language = 'en') {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

  if (!text || !String(text).trim()) {
    return Promise.resolve();
  }

  publishVoiceStatus({ phase: 'speaking', text });

  const finish = () => {
    publishVoiceStatus({ phase: 'idle', text: '' });
    return Promise.resolve();
  };

  if (!apiKey || !voiceId) {
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = getVoiceLocale(language);
          const onDone = () => {
            publishVoiceStatus({ phase: 'idle', text: '' });
            resolve();
          };
          utterance.onend = onDone;
          utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            onDone();
          };
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.warn('Speech synthesis failed:', error);
          finish().then(resolve);
        }
      });
    }
    return finish();
  }

  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.7,
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`ElevenLabs request failed with status ${response.status}`);
      }
      return response.blob();
    })
    .then((audioBlob) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise((resolve) => {
        const onDone = () => {
          audio.removeEventListener('ended', onDone);
          audio.removeEventListener('error', onDone);
          publishVoiceStatus({ phase: 'idle', text: '' });
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.addEventListener('ended', onDone, { once: true });
        audio.addEventListener('error', (event) => {
          console.warn('Audio playback error:', event);
          onDone();
        }, { once: true });

        audio.play().catch((error) => {
          console.warn('Audio playback failed:', error);
          onDone();
        });
      });
    })
    .catch((error) => {
      console.warn('Cloud voice failed, falling back to browser voice:', error);

      if (!('speechSynthesis' in window)) {
        publishVoiceStatus({ phase: 'idle', text: '' });
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = getVoiceLocale(language);
          const onDone = () => {
            publishVoiceStatus({ phase: 'idle', text: '' });
            resolve();
          };
          utterance.onend = onDone;
          utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            onDone();
          };
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.warn('Speech synthesis failed:', error);
          finish().then(resolve);
        }
      });
    });
}

export function listen({ timeoutMs = 30000, language = 'en' } = {}) {
  return new Promise((resolve) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      publishVoiceStatus({ phase: 'idle', text: '' });
      // Publish unsupported browser event for UI to handle
      publishVoiceStatus({ phase: 'error', text: 'Speech recognition not supported in this browser' });
      resolve(null);
      return;
    }

    const recognition = new SpeechRecognition();
    publishVoiceStatus({ phase: 'listening', text: 'Listening...' });
    let settled = false;
    recognition.lang = getVoiceLocale(language);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const timer = window.setTimeout(() => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      finishListening();
    }, timeoutMs);

    const finishListening = (transcript = null) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timer);
      publishVoiceStatus({ phase: 'idle', text: '' });
      resolve(transcript);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      finishListening(transcript.trim() || null);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      finishListening();
    };

    recognition.onend = () => {
      finishListening();
    };

    try {
      recognition.start();
    } catch (error) {
      console.warn('Error starting recognition:', error);
      finishListening();
    }
  });
}

export const voiceService = { speak, listen, subscribeVoiceStatus, setVoiceStatus };
export default { speak, listen, subscribeVoiceStatus, setVoiceStatus };
