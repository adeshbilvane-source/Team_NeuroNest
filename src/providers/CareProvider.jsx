import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMachine } from '@xstate/react';
import careMachine from '../orchestrator/careMachine';
import { voiceService } from '../services/VoiceService';
import { getSupportedLanguage } from '../i18n';
import { getTodaysTask } from '../schedule/weeklyPlan';

function isTaskDue(task, now = new Date()) {
  if (!task?.time) {
    return false;
  }

  const [hour, minute] = task.time.split(':').map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hour * 60 + minute;

  return Math.abs(minutes - targetMinutes) <= 15;
}

const CareContext = createContext(null);

export function useCare() {
  const context = useContext(CareContext);

  if (!context) {
    throw new Error('useCare must be used inside a CareProvider');
  }

  return context;
}

export default function CareProvider({ children }) {
  const { i18n } = useTranslation();
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage || i18n.language);
  const [state, send] = useMachine(careMachine);
  const timerRef = useRef(null);
  const scheduledTask = useMemo(() => getTodaysTask(), []);
  const activeScheduledWalkthrough = state.matches('guidingTask') && Boolean(scheduledTask);

  useEffect(() => {
    if (state.matches('greeting')) {
      voiceService.speak('Hello! I am Sahayak. Let us begin your care session.', currentLanguage);
    }

    if (state.matches('announcingTask')) {
      const taskName = scheduledTask?.taskName || 'your care activity';
      voiceService.speak(`Today's activity is ${taskName}. Let's get started.`, currentLanguage);
    }

    if (state.matches('checkingIn')) {
      voiceService.speak('Just checking in. Are you ready to continue?', currentLanguage);
    }
  }, [scheduledTask, state, currentLanguage]);

  useEffect(() => {
    if (!state.matches('guidingTask')) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    const delayMinutes = 30 + Math.random() * 15;
    const delayMs = delayMinutes * 60 * 1000;

    timerRef.current = window.setTimeout(() => {
      send({ type: 'CHECK_IN_DUE' });
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state, send]);

  useEffect(() => {
    if (!state.matches('checkingIn')) {
      return undefined;
    }

    let cancelled = false;

    const runCheckIn = async () => {
      try {
        const answer = await voiceService.listen({ timeoutMs: 8000, language: currentLanguage });

        if (cancelled) {
          return;
        }

        const normalized = (answer || '').toLowerCase().trim();

        if (!normalized) {
          send({ type: 'NO_RESPONSE' });
          return;
        }

        if (/(continue|keep going|yes|yep|okay|ready|go)/.test(normalized)) {
          send({ type: 'WANTS_TO_CONTINUE' });
          return;
        }

        if (/(switch|change|different|stop|pause|later|another)/.test(normalized)) {
          send({ type: 'WANTS_TO_SWITCH' });
          return;
        }

        send({ type: 'NO_RESPONSE' });
      } catch (error) {
        console.error('Error during check-in:', error);
        send({ type: 'NO_RESPONSE' });
      }
    };

    runCheckIn();

    return () => {
      cancelled = true;
    };
  }, [state, send, currentLanguage]);

  // Note: Screen time cap feature deferred pending product requirements:
  // - Definition: wall-clock time since first app open, or only active task time?
  // - Enforcement: hard lock, gentle wind-down, or task interruption?
  // - Implementation status: Requires product owner decision before coding.

  const value = {
    state,
    send,
    scheduledTask,
    activeScheduledWalkthrough,
  };

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}
