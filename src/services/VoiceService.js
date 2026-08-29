export function speak(text) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

  if (!text || !String(text).trim()) {
    return Promise.resolve();
  }

  if (!apiKey || !voiceId) {
    console.warn('Missing ElevenLabs env vars. Falling back to browser voice.');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
    return Promise.resolve();
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
      return audio.play();
    })
    .catch((error) => {
      console.warn('Cloud voice failed, falling back to browser voice:', error);

      if (!('speechSynthesis' in window)) {
        return undefined;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return undefined;
    });
}

export function listen({ timeoutMs = 6000 } = {}) {
  return new Promise((resolve) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition is not supported in this browser.');
      resolve(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const timer = window.setTimeout(() => {
      recognition.stop();
      resolve(null);
    }, timeoutMs);

    recognition.onresult = (event) => {
      window.clearTimeout(timer);
      const transcript = event.results[0][0]?.transcript || '';
      resolve(transcript.trim() || null);
    };

    recognition.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };

    recognition.onend = () => {
      window.clearTimeout(timer);
    };

    recognition.start();
  });
}

export const voiceService = { speak, listen };
export default { speak, listen };
