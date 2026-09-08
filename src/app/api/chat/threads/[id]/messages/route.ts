import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { chatMessages } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { ChatAccessError, assertThreadAccess } from '@/lib/chat-access'
import { listMessagesQuerySchema, sendMessageSchema, threadIdParamSchema } from '@/lib/validations/chat'

function toError(error: unknown) {
  if (error instanceof ChatAccessError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  throw error
}

type Params = { params: Promise<{ id: string }> }

// GET /api/chat/threads/[id]/messages?limit=50 — latest messages, chrono order.
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = threadIdParamSchema.parse(await params)
    const access = await assertThreadAccess(id)

    const { searchParams } = new URL(req.url)
    const { limit } = listMessagesQuerySchema.parse({
      limit: searchParams.get('limit') ?? undefined,
    })

    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.threadId, access.threadId))
      .orderBy(asc(chatMessages.createdAt))
      .limit(limit)

    return NextResponse.json(messages)
  } catch (error) {
    return toError(error)
  }
}

// POST /api/chat/threads/[id]/messages — send a message to the thread.
export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = threadIdParamSchema.parse(await params)
    const access = await assertThreadAccess(id)

    const raw = await req.json()
    const input = sendMessageSchema.parse(raw)

    const [message] = await db
      .insert(chatMessages)
      .values({
        threadId: access.threadId,
        senderId: access.userId,
        senderRole: input.senderRole === 'admin' && access.actor !== 'admin' ? access.actor : input.senderRole,
        body: input.body,
      })
      .returning()

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return toError(error)
  }
}
