'use client'

import { useEffect, useState } from 'react'
import { ChatThread } from '@/components/chat/chat-thread'
import { Button } from '@/components/ui/button'

interface ThreadItem {
  id: string
  jobRequestId?: string | null
  jobTitle?: string | null
  lastMessage?: { body: string; createdAt?: string | null } | null
}

interface JobItem {
  id: string
  title: string
}

export default function ReclutadorChat() {
  const [threads, setThreads] = useState<ThreadItem[]>([])
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const loadThreads = async () => {
    const res = await fetch('/api/chat/threads')
    if (res.ok) {
      const data = (await res.json()) as ThreadItem[]
      setThreads(data)
      setSelectedId((prev) => prev ?? data[0]?.id ?? null)
    }
  }

  useEffect(() => {
    fetch('/api/chat/threads')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ThreadItem[]) => {
        setThreads(data)
        setSelectedId((prev) => prev ?? data[0]?.id ?? null)
      })
      .catch(() => {})
    fetch('/api/solicitudes')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: JobItem[]) => setJobs(data.slice(0, 20)))
      .catch(() => {})
  }, [])

  const startThread = async (jobRequestId: string) => {
    setCreating(true)
    try {
      const res = await fetch('/api/chat/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRequestId }),
      })
      if (res.ok) {
        const thread = (await res.json()) as ThreadItem
        await loadThreads()
        setSelectedId(thread.id)
      }
    } finally {
      setCreating(false)
    }
  }

  const jobsWithoutThread = jobs.filter((j) => !threads.some((t) => t.jobRequestId === j.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chat</h1>
        <p className="text-slate-600">Seguimiento conversacional con las empresas</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border divide-y max-h-[560px] overflow-y-auto">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`w-full text-left p-4 hover:bg-slate-50 ${
                selectedId === t.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <p className="font-medium text-slate-900 text-sm">{t.jobTitle ?? 'Conversación'}</p>
              <p className="text-xs text-slate-500 truncate mt-1">
                {t.lastMessage?.body ?? 'Sin mensajes'}
              </p>
            </button>
          ))}
          {threads.length === 0 && (
            <p className="p-4 text-sm text-slate-500">Sin conversaciones todavía.</p>
          )}
          {jobsWithoutThread.length > 0 && (
            <div className="p-4 space-y-2 bg-slate-50">
              <p className="text-xs font-semibold text-slate-600 uppercase">Iniciar conversación</p>
              {jobsWithoutThread.slice(0, 5).map((j) => (
                <div key={j.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-slate-700">{j.title}</span>
                  <Button size="sm" variant="outline" disabled={creating} onClick={() => startThread(j.id)}>
                    Iniciar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2 bg-white rounded-lg border p-4">
          {selectedId ? (
            <ChatThread key={selectedId} threadId={selectedId} />
          ) : (
            <p className="text-sm text-slate-500 text-center py-16">
              Seleccioná una conversación para ver los mensajes.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
