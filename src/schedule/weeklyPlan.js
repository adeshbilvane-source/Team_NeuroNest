export const weeklyPlan = {
  Mon: {
    time: '11:00',
    taskName: 'Memory cards',
    path: ['Activity', 'Games hub > Memory cards tile', 'Memory Match > Fruits & Veg category'],
  },
  Tue: {
    time: '14:00',
    taskName: 'Yoga & Rest',
    path: ['Activity', 'Games hub > Yoga & Rest tile', 'Yoga > Mountain Pose'],
  },
  Wed: {
    time: '11:00',
    taskName: 'Memory cards',
    path: ['Activity', 'Games hub > Memory cards tile', 'Memory Match > Fruits & Veg category'],
  },
  Thu: {
    time: '16:00',
    taskName: 'Therapy Video',
    path: ['Videos', 'Videos tab > Calming Videos'],
  },
  Fri: {
    time: '09:30',
    taskName: 'Family photos',
    path: ['Activity', 'Games hub > Picture game tile', 'Identify Picture > Family photos tab'],
  },
  Sat: {
    time: '10:30',
    taskName: 'Uploaded Video',
    path: ['Videos', 'Videos tab > Your Uploaded Videos'],
  },
  Sun: {
    time: '15:00',
    taskName: 'Yoga & Rest',
    path: ['Activity', 'Games hub > Yoga & Rest tile', 'Yoga > Gentle Cat-Cow Flow'],
  },
};

export function getTodaysTask(date = new Date()) {
  const safeDate = date instanceof Date ? date : new Date(date);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayKey = dayNames[safeDate.getDay()];

  return weeklyPlan[dayKey] || null;
}

export default weeklyPlan;
