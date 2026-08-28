import type { CSSProperties } from 'react'

type PatientAvatarProps = {
  patientId: string
  initials: string
  name: string
  className?: string
  style?: CSSProperties
}

const patientPhotos: Record<string, string> = {
  'ramesh-kulkarni': '/patients_pp/patient5.jpeg',
  'sunita-rao': '/patients_pp/patient6.jpeg',
  'vikram-patil': '/patients_pp/patient4.jpg',
  'anjali-deshmukh': '/patients_pp/patient1.jpg',
  'manoj-joshi': '/patients_pp/patient3.jpg',
  'sneha-kulkarni': '/patients_pp/patient2.jpg',
}

export default function PatientAvatar({ patientId, initials, name, className = '', style }: PatientAvatarProps) {
  const photo = patientPhotos[patientId]

  return photo ? (
    <img src={photo} alt={`${name} profile`} className={`object-cover ${className}`} style={style} />
  ) : (
    <div className={className} style={style} aria-label={`${name} initials`}>
      {initials}
    </div>
  )
}
