export const weeklyPlan = {
  Mon: 'memoryMatch',
  Tue: 'memoryMatch',
  Wed: 'yoga',
  Thu: 'videos',
  Fri: 'memoryMatch',
  Sat: 'yoga',
  Sun: 'videos',
};

export function getTodaysTask(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date(date);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayKey = dayNames[safeDate.getDay()];

  return weeklyPlan[dayKey] || 'memoryMatch';
}

export default weeklyPlan;
