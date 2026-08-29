import { useMemo } from 'react'

export type SearchCategory = 'patients' | 'appointments' | 'messages' | 'analytics'

export type UniversalSearchResult = {
  id: string
  category: SearchCategory
  title: string
  initials?: string
  subtitle: string
  route: string
  searchText: string
}

export type UniversalSearchGroup = {
  category: SearchCategory
  label: string
  results: UniversalSearchResult[]
}

const SEARCH_GROUPS: UniversalSearchGroup[] = [
  {
    category: 'patients',
    label: 'Patients',
    results: [
      { id: 'ramesh-kulkarni', category: 'patients', initials: 'RK', title: 'Ramesh Kulkarni', subtitle: 'Age 74 · Next visit today at 11:00 AM', route: '/doctor/patients/ramesh-kulkarni', searchText: 'Ramesh Kulkarni age 74 next visit today' },
      { id: 'sunita-rao', category: 'patients', initials: 'SR', title: 'Sunita Rao', subtitle: 'Age 68 · Hypertension', route: '/doctor/patients/sunita-rao', searchText: 'Sunita Rao age 68 hypertension' },
      { id: 'vikram-patil', category: 'patients', initials: 'VP', title: 'Vikram Patil', subtitle: 'Age 52 · Post-surgery care', route: '/doctor/patients/vikram-patil', searchText: 'Vikram Patil age 52 post surgery care' },
      { id: 'anjali-deshmukh', category: 'patients', initials: 'AD', title: 'Anjali Deshmukh', subtitle: 'Age 61 · Arthritis', route: '/doctor/patients/anjali-deshmukh', searchText: 'Anjali Deshmukh age 61 arthritis' },
      { id: 'manoj-joshi', category: 'patients', initials: 'MJ', title: 'Manoj Joshi', subtitle: 'Age 70 · New patient', route: '/doctor/patients/manoj-joshi', searchText: 'Manoj Joshi age 70 new patient' },
    ],
  },
  {
    category: 'appointments',
    label: 'Appointments',
    results: [
      { id: 'a1', category: 'appointments', title: 'Ramesh Kulkarni · 11:00 AM', subtitle: 'Upcoming · Routine checkup', route: '/doctor/appointments/a1', searchText: 'Ramesh Kulkarni 11:00 AM upcoming routine checkup' },
      { id: 'a2', category: 'appointments', title: 'Vikram Patil · 3:00 PM', subtitle: 'Upcoming · Follow-up', route: '/doctor/appointments/a2', searchText: 'Vikram Patil 3:00 PM upcoming follow up' },
      { id: 'a3', category: 'appointments', title: 'Anjali Deshmukh · 5:30 PM', subtitle: 'Upcoming · Medication review', route: '/doctor/appointments/a3', searchText: 'Anjali Deshmukh 5:30 PM upcoming medication review' },
      { id: 'a5', category: 'appointments', title: 'Sunita Rao · 22 Aug', subtitle: 'Past · Blood pressure review', route: '/doctor/appointments/a5', searchText: 'Sunita Rao 22 Aug past blood pressure review' },
    ],
  },
  {
    category: 'messages',
    label: 'Messages',
    results: [
      { id: 'ramesh-kulkarni', category: 'messages', title: 'Ramesh Kulkarni', subtitle: 'Message thread · 2 unread', route: '/doctor/chat/ramesh-kulkarni', searchText: 'Ramesh Kulkarni message thread unread' },
      { id: 'sunita-rao', category: 'messages', title: 'Sunita Rao', subtitle: 'Message thread · Last message yesterday', route: '/doctor/chat/sunita-rao', searchText: 'Sunita Rao message thread yesterday' },
      { id: 'anjali-deshmukh', category: 'messages', title: 'Anjali Deshmukh', subtitle: 'Message thread · Last message Monday', route: '/doctor/chat/anjali-deshmukh', searchText: 'Anjali Deshmukh message thread Monday' },
    ],
  },
  {
    category: 'analytics',
    label: 'Analytics',
    results: [
      { id: 'sunita-rao', category: 'analytics', title: 'Sunita Rao', subtitle: 'Attention needed · Reaction time is rising', route: '/doctor/analytics/sunita-rao', searchText: 'Sunita Rao analytics attention reaction time rising' },
      { id: 'manoj-joshi', category: 'analytics', title: 'Manoj Joshi', subtitle: 'Attention needed · Attention score is lower', route: '/doctor/analytics/manoj-joshi', searchText: 'Manoj Joshi analytics attention score lower' },
      { id: 'ramesh-kulkarni', category: 'analytics', title: 'Ramesh Kulkarni', subtitle: 'Stable · Reaction time improving', route: '/doctor/analytics/ramesh-kulkarni', searchText: 'Ramesh Kulkarni analytics stable reaction time improving' },
      { id: 'vikram-patil', category: 'analytics', title: 'Vikram Patil', subtitle: 'Stable · No significant change', route: '/doctor/analytics/vikram-patil', searchText: 'Vikram Patil analytics stable no significant change' },
    ],
  },
]

export function useUniversalSearch(query: string) {
  return useMemo(() => {
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!keywords.length) return []

    return SEARCH_GROUPS
      .map((group) => ({
        ...group,
        results: group.results.filter((result) => {
          const searchableText = `${group.label} ${result.title} ${result.subtitle} ${result.searchText}`.toLowerCase()
          return keywords.every((keyword) => searchableText.includes(keyword))
        }),
      }))
      .filter((group) => group.results.length > 0)
  }, [query])
}