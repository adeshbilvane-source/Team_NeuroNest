import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCare } from '../providers/CareProvider';
import { voiceService } from '../services/voiceService';
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

  const routeKey = useMemo(() => resolveRouteKey(location.pathname), [location.pathname]);

  useEffect(() => {
    const scriptFactory = pageScripts[routeKey];
    if (!scriptFactory) {
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
      if (cancelled || !scriptState.options || scriptState.options.length === 0) {
        return;
      }

      const answer = await voiceService.listen({ timeoutMs: 6000 });
      if (cancelled) {
        return;
      }

      const normalized = (answer || '').trim().toLowerCase();
      const selected = scriptState.options.find((option) => {
        const label = (option.label || '').toLowerCase();
        return normalized.includes(label.toLowerCase());
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
