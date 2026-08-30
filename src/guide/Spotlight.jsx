import { useEffect, useMemo, useState } from 'react';

export default function Spotlight({ script, targetId, pulse = false }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!targetId) {
      setRect(null);
      return undefined;
    }

    const updateRect = () => {
      const target = document.querySelector(`[data-guide-id="${targetId}"]`);
      if (!target) {
        setRect(null);
        return;
      }

      const bounds = target.getBoundingClientRect();
      setRect({
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetId]);

  const style = useMemo(() => {
    if (!rect) {
      return null;
    }

    return {
      position: 'fixed',
      top: rect.top - 8,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16,
      borderRadius: '18px',
      border: pulse ? '3px solid #F4C14F' : '2px solid rgba(244, 193, 79, 0.9)',
      boxShadow: pulse
        ? '0 0 0 9999px rgba(17, 22, 20, 0.48), 0 0 0 6px rgba(244, 193, 79, 0.35)'
        : '0 0 0 9999px rgba(17, 22, 20, 0.44)',
      animation: pulse ? 'guidePulse 0.8s ease-in-out infinite alternate' : 'none',
      pointerEvents: 'none',
      zIndex: 1200,
    };
  }, [pulse, rect]);

  if (!script || !targetId || !style) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes guidePulse {
          0% { box-shadow: 0 0 0 9999px rgba(17, 22, 20, 0.48), 0 0 0 6px rgba(244, 193, 79, 0.2), 0 0 14px rgba(244, 193, 79, 0.55); }
          100% { box-shadow: 0 0 0 9999px rgba(17, 22, 20, 0.48), 0 0 0 10px rgba(244, 193, 79, 0.4), 0 0 24px rgba(244, 193, 79, 0.85); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1190, pointerEvents: 'none' }}>
        <div style={style} />
      </div>
    </>
  );
}
