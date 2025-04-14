"use client"

interface NotificationProps {
  message: string | null
}

/**
 * 通知组件
 */
const Notification = ({ message }: NotificationProps) => {
  if (!message) return null

  return (
    <div className="animate-fade-in-up fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 transform rounded-lg bg-zinc-800/90 px-4 py-3 text-white shadow-lg backdrop-blur-md">
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default Notification
