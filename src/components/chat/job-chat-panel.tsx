'use client'

import { useEffect, useState } from 'react'
import { ChatThread } from '@/components/chat/chat-thread'
import { Button } from '@/components/ui/button'

interface ThreadItem {
  id: string
}

export function JobChatPanel({ jobRequestId }: { jobRequestId: string }) {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetch(`/api/chat/threads?jobRequestId=${jobRequestId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ThreadItem[]) => {
        setThreadId(data[0]?.id ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [jobRequestId])

  const start = async () => {
    setStarting(true)
    try {
      const res = await fetch('/api/chat/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequestId }),
      })
      if (res.ok) {
        const thread = (await res.json()) as ThreadItem
        setThreadId(thread.id)
      }
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
  }

  if (!threadId) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-slate-500 mb-3">Todavía no hay conversación con tu reclutador.</p>
        <Button onClick={start} disabled={starting}>
          {starting ? 'Iniciando…' : 'Iniciar conversación'}
        </Button>
      </div>
    )
  }

  return <ChatThread threadId={threadId} />
}
