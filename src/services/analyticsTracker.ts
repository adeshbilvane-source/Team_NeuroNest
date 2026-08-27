export const recordGameSession = (gameName: string, icon: string, color: string, durationMinutes: number) => {
  if (durationMinutes <= 0) return;

  const raw = localStorage.getItem('sahayak_game_analytics');
  const analytics: Record<string, Record<string, { minutes: number; icon: string; color: string }>> = raw ? JSON.parse(raw) : {};

  const todayKey = new Date().toISOString().split('T')[0]; // e.g. "2026-08-27"
  
  if (!analytics[todayKey]) {
    analytics[todayKey] = {};
  }

  if (!analytics[todayKey][gameName]) {
    analytics[todayKey][gameName] = { minutes: 0, icon, color };
  }

  analytics[todayKey][gameName].minutes += Math.round(durationMinutes);
  localStorage.setItem('sahayak_game_analytics', JSON.stringify(analytics));
};