import { ArrowLeft, Bell, CheckCheck, MessageCircle, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Notification = { id: number; title: string; detail: string; time: string; kind: 'appointment' | 'message' | 'request'; unread: boolean }

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Appointment starting soon', detail: 'Ramesh Kulkarni · Today at 11:00 AM', time: '10 min ago', kind: 'appointment', unread: true },
  { id: 2, title: 'New patient request', detail: 'Manoj Joshi requested a care review', time: '35 min ago', kind: 'request', unread: true },
  { id: 3, title: 'New message', detail: 'Vikram Patil sent you a message', time: '1 hour ago', kind: 'message', unread: false },
  { id: 4, title: 'Appointment confirmed', detail: 'Anjali Deshmukh confirmed the 5:30 PM visit', time: 'Yesterday', kind: 'appointment', unread: false },
]

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((notification) => notification.unread).length

  const markAllRead = () => setNotifications((items) => items.map((notification) => ({ ...notification, unread: false })))
  const markRead = (id: number) => setNotifications((items) => items.map((notification) => notification.id === id ? { ...notification, unread: false } : notification))

  return (
    <div className="min-h-screen bg-canvas font-ui flex flex-col">
      <div className="page-header px-4.5 pt-11 pb-3.5 bg-white shadow-sm flex items-center gap-3">
        <button onClick={() => navigate('/doctor')} aria-label="Back" className="w-[38px] h-[38px] rounded-xl bg-brand-green-tint flex items-center justify-center flex-shrink-0"><ArrowLeft size={19} className="text-brand-green" strokeWidth={2.6} /></button>
        <div className="flex-1"><h1 className="font-display italic font-semibold text-xl text-ink">Notifications</h1><p className="m-0 text-[11px] text-ink-soft font-bold">{unreadCount ? `${unreadCount} need your attention` : 'You are all caught up'}</p></div>
        {unreadCount > 0 && <button onClick={markAllRead} aria-label="Mark all as read" className="text-brand-green"><CheckCheck size={19} /></button>}
      </div>
      <div className="flex-1 overflow-y-auto px-4.5 py-4.5 pb-8">
        {notifications.map((notification) => <button key={notification.id} onClick={() => markRead(notification.id)} className={`w-full text-left bg-white rounded-2xl p-3.5 mb-2.5 flex items-start gap-3 shadow-sm ${notification.unread ? 'border-l-4 border-marigold' : ''}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.unread ? 'bg-marigold-tint text-marigold' : 'bg-brand-green-tint text-brand-green'}`}>
            {notification.kind === 'appointment' ? <Bell size={18} /> : notification.kind === 'request' ? <UserPlus size={18} /> : <MessageCircle size={18} />}
          </div>
          <div className="min-w-0 flex-1"><h2 className="m-0 text-[13.5px] font-extrabold text-ink">{notification.title}</h2><p className="m-0 mt-1 text-[11.5px] text-ink-soft font-bold leading-relaxed">{notification.detail}</p><p className="m-0 mt-1.5 text-[10px] text-ink-soft font-bold">{notification.time}</p></div>
          {notification.unread && <span className="w-2 h-2 rounded-full bg-alert-red flex-shrink-0 mt-1" />}
        </button>)}
      </div>
    </div>
  )
}
