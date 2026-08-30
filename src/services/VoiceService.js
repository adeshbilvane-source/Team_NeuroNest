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

export function speak(text) {
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
    console.warn('Missing ElevenLabs env vars. Falling back to browser voice.');
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const onDone = () => {
          publishVoiceStatus({ phase: 'idle', text: '' });
          resolve();
        };
        utterance.onend = onDone;
        utterance.onerror = onDone;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
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
        audio.addEventListener('error', onDone, { once: true });
        audio.play().catch(() => onDone());
      });
    })
    .catch((error) => {
      console.warn('Cloud voice failed, falling back to browser voice:', error);

      if (!('speechSynthesis' in window)) {
        return undefined;
      }

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const onDone = () => {
          publishVoiceStatus({ phase: 'idle', text: '' });
          resolve();
        };
        utterance.onend = onDone;
        utterance.onerror = onDone;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      });
    });
}

export function listen({ timeoutMs = 30000 } = {}) {
  return new Promise((resolve) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition is not supported in this browser.');
      publishVoiceStatus({ phase: 'idle', text: '' });
      resolve(null);
      return;
    }

    const recognition = new SpeechRecognition();
    publishVoiceStatus({ phase: 'listening', text: 'Listening...' });
    let settled = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const timer = window.setTimeout(() => {
      recognition.stop();
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
      const transcript = event.results[0][0]?.transcript || '';
      finishListening(transcript.trim() || null);
    };

    recognition.onerror = () => {
      finishListening();
    };

    recognition.onend = () => {
      finishListening();
    };

    recognition.start();
  });
}

export const voiceService = { speak, listen, subscribeVoiceStatus, setVoiceStatus };
export default { speak, listen, subscribeVoiceStatus, setVoiceStatus };
