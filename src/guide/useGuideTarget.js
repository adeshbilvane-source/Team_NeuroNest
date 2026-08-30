import { useCallback } from 'react';

export default function useGuideTarget(targetId) {
  return useCallback((node) => {
    if (!node) {
      return;
    }

    node.setAttribute('data-guide-id', targetId);
    node.dataset.guideId = targetId;
  }, [targetId]);
}
