'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  senderId?: string | null
  senderRole?: string | null
  body: string
  createdAt?: string | null
}

const POLL_MS = 5000

export function ChatThread({ threadId }: { threadId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages?limit=50`)
      if (res.ok) setMessages(await res.json())
    } catch {
      // Polling is best-effort; the next tick retries.
    }
  }, [threadId])

  useEffect(() => {
    let cancelled = false
    const poll = () => {
      fetch(`/api/chat/threads/${threadId}/messages?limit=50`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled && data) setMessages(data)
        })
        .catch(() => {
          // Polling is best-effort; the next tick retries.
        })
    }
    poll()
    const timer = setInterval(poll, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [threadId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? 'No se pudo enviar el mensaje')
      }
      setDraft('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[480px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-t-lg border border-b-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              m.senderRole === 'company'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-white border text-slate-800'
            }`}
          >
            <p className="text-[11px] opacity-70 mb-0.5">
              {m.senderRole === 'company' ? 'Empresa' : m.senderRole === 'admin' ? 'Admin' : 'Reclutador'}
            </p>
            <p className="whitespace-pre-wrap">{m.body}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">Sin mensajes todavía. Iniciá la conversación.</p>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border rounded-b-lg p-3 bg-white">
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Escribí un mensaje…"
            maxLength={2000}
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={send} disabled={sending || !draft.trim()}>
            {sending ? 'Enviando…' : 'Enviar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
