import { createContext, useContext, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import careMachine from '../orchestrator/careMachine';
import { voiceService } from '../services/voiceService';
import { getTodaysTask } from '../schedule/weeklyPlan';

const CareContext = createContext(null);

export function useCare() {
  const context = useContext(CareContext);

  if (!context) {
    throw new Error('useCare must be used inside a CareProvider');
  }

  return context;
}

export default function CareProvider({ children }) {
  const [state, send] = useMachine(careMachine);
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.matches('greeting')) {
      voiceService.speak('Hello! I am Sahayak. Let us begin your care session.');
    }

    if (state.matches('announcingTask')) {
      const taskName = getTodaysTask();
      voiceService.speak(`Today’s activity is ${taskName}. Let’s get started.`);
    }

    if (state.matches('checkingIn')) {
      voiceService.speak('Just checking in. Are you ready to continue?');
    }
  }, [state]);

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
      const answer = await voiceService.listen({ timeoutMs: 6000 });

      if (cancelled) {
        return;
      }

      const normalized = (answer || '').toLowerCase();

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
    };

    runCheckIn();

    return () => {
      cancelled = true;
    };
  }, [state, send]);

  const value = { state, send };

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}
