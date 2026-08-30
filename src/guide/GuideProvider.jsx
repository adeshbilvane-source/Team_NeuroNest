import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCare } from '../providers/CareProvider';
import { setVoiceStatus, subscribeVoiceStatus, voiceService } from '../services/VoiceService';
import Spotlight from './Spotlight';
import pageScripts from './pageScripts';

function resolveRouteKey(pathname) {
  if (!pathname || pathname === '/') {
    return 'home';
  }

  const routeMap = {
    '/patient': 'home',
    '/patient/activities': 'activities',
    '/patient/games': 'gamesHub',
    '/patient/games/identify-picture': 'identifyPicture',
    '/patient/games/memory-match': 'memoryMatch',
    '/patient/games/jigsaw': 'jigsaw',
    '/patient/games/button-sorting': 'buttonSorting',
    '/patient/videos-library': 'videosLibrary',
    '/patient/yoga': 'yoga',
  };

  return routeMap[pathname] || 'home';
}

export default function GuideProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeScheduledWalkthrough, scheduledTask } = useCare();
  const [scriptState, setScriptState] = useState(null);
  const lastScriptRef = useRef('');
  const [voiceStatus, setVoiceStatusState] = useState({ phase: 'idle', text: '' });

  const routeKey = useMemo(() => resolveRouteKey(location.pathname), [location.pathname]);

  useEffect(() => subscribeVoiceStatus(setVoiceStatusState), []);

  useEffect(() => {
    const scriptFactory = pageScripts[routeKey];
    if (!scriptFactory || !activeScheduledWalkthrough) {
      setScriptState(null);
      return;
    }

    const context = {
      activeScheduledWalkthrough,
      scheduledTask,
      pathname: location.pathname,
      currentTab: routeKey === 'identifyPicture' ? 'Random' : routeKey === 'videosLibrary' ? 'videos' : routeKey === 'memoryMatch' ? 'Fruits & Veg' : routeKey === 'jigsaw' ? 'photo' : routeKey === 'buttonSorting' ? 'shape' : undefined,
    };

    const nextScript = scriptFactory(context);
    setScriptState(nextScript);
    lastScriptRef.current = `${routeKey}:${nextScript?.onEnter || ''}:${nextScript?.targetId || ''}`;
  }, [activeScheduledWalkthrough, location.pathname, routeKey, scheduledTask]);

  useEffect(() => {
    if (!scriptState?.onEnter) {
      return undefined;
    }

    let cancelled = false;

    const runGuideTurn = async () => {
      await voiceService.speak(scriptState.onEnter);
      setVoiceStatus({ phase: 'pause', text: scriptState.onEnter });
      await new Promise((resolve) => window.setTimeout(resolve, 3000));
      if (cancelled || !scriptState.options || scriptState.options.length === 0) {
        return;
      }

      const answer = await voiceService.listen({ timeoutMs: 30000 });
      if (cancelled) {
        return;
      }

      const normalized = (answer || '').trim().toLowerCase();
      if (normalized.includes('activit')) {
        navigate('/patient/activities');
        return;
      }

      const selected = scriptState.options.find((option) => {
        const labels = [option.label, ...(option.aliases || [])]
          .filter(Boolean)
          .map((label) => label.toLowerCase());
        return labels.some((label) => normalized.includes(label));
      });

      if (selected?.route) {
        navigate(selected.route);
      }
    };

    runGuideTurn();

    return () => {
      cancelled = true;
    };
  }, [navigate, scriptState]);

  const spotlightTarget = scriptState?.targetId || null;
  const shouldPulse = !!scriptState?.single;

  return (
    <>
      {children}
      {voiceStatus.phase !== 'idle' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 88,
            transform: 'translateX(-50%)',
            zIndex: 1300,
            maxWidth: 'min(380px, calc(100vw - 32px))',
            padding: '10px 16px',
            borderRadius: 999,
            background: '#24322A',
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {voiceStatus.phase === 'listening' ? 'Listening...' : voiceStatus.text}
        </div>
      )}
      {scriptState && (
        <Spotlight
          script={scriptState}
          targetId={spotlightTarget}
          pulse={shouldPulse}
        />
      )}
    </>
  );
}
