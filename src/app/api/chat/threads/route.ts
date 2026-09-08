import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { chatMessages, chatThreads, companies, jobRequests, recruiters } from '@/lib/db/schema'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { ChatAccessError, assertJobChatAccess } from '@/lib/chat-access'
import { createThreadSchema } from '@/lib/validations/chat'
import { resolveRole } from '@/lib/role'

function toError(error: unknown) {
  if (error instanceof ChatAccessError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  throw error
}

// GET /api/chat/threads?jobRequestId=<uuid> — threads for one job.
// Without jobRequestId: threads across the caller's scope
// (assigned jobs for recruiters, owned jobs for companies, all for admins).
export async function GET(req: Request) {
  try {
    const { userId, orgId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const jobRequestId = searchParams.get('jobRequestId')

    let jobIds: string[]
    if (jobRequestId) {
      await assertJobChatAccess(jobRequestId)
      jobIds = [jobRequestId]
    } else {
      jobIds = await scopedJobIds(userId, orgId)
    }

    if (jobIds.length === 0) return NextResponse.json([])

    const threads = await db
      .select({
        id: chatThreads.id,
        jobRequestId: chatThreads.jobRequestId,
        applicationId: chatThreads.applicationId,
        createdAt: chatThreads.createdAt,
        jobTitle: jobRequests.title,
      })
      .from(chatThreads)
      .innerJoin(jobRequests, eq(chatThreads.jobRequestId, jobRequests.id))
      .where(inArray(chatThreads.jobRequestId, jobIds))
      .orderBy(desc(chatThreads.createdAt))

    const withPreview = await Promise.all(
      threads.map(async (t) => {
        const [last] = await db
          .select({ body: chatMessages.body, createdAt: chatMessages.createdAt })
          .from(chatMessages)
          .where(eq(chatMessages.threadId, t.id))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1)
        return { ...t, lastMessage: last ?? null }
      })
    )

    return NextResponse.json(withPreview)
  } catch (error) {
    return toError(error)
  }
}

// POST /api/chat/threads — create (or reuse) a thread for a job request.
export async function POST(req: Request) {
  try {
    const raw = await req.json()
    const input = createThreadSchema.parse(raw)
    const access = await assertJobChatAccess(input.jobRequestId)

    if (input.applicationId) {
      const [existing] = await db
        .select()
        .from(chatThreads)
        .where(
          and(
            eq(chatThreads.jobRequestId, input.jobRequestId),
            eq(chatThreads.applicationId, input.applicationId)
          )
        )
      if (existing) return NextResponse.json(existing)
    }

    const [thread] = await db
      .insert(chatThreads)
      .values({
        jobRequestId: input.jobRequestId,
        applicationId: input.applicationId,
      })
      .returning()

    await db.insert(chatMessages).values({
      threadId: thread.id,
      senderId: access.userId,
      senderRole: access.actor,
      body: 'Conversación iniciada.',
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    return toError(error)
  }
}

async function scopedJobIds(userId: string, orgId: string | null | undefined): Promise<string[]> {
  const user = await currentUser()
  if (resolveRole(user) === 'admin') {
    const all = await db.select({ id: jobRequests.id }).from(jobRequests)
    return all.map((j) => j.id)
  }

  const ids = new Set<string>()

  const [recruiter] = await db.select().from(recruiters).where(eq(recruiters.userId, userId))
  if (recruiter) {
    const assigned = await db
      .select({ id: jobRequests.id })
      .from(jobRequests)
      .where(eq(jobRequests.recruiterId, recruiter.id))
    for (const j of assigned) ids.add(j.id)
  }

  if (orgId) {
    const [company] = await db.select().from(companies).where(eq(companies.clerkOrgId, orgId))
    if (company) {
      const owned = await db
        .select({ id: jobRequests.id })
        .from(jobRequests)
        .where(eq(jobRequests.companyId, company.id))
      for (const j of owned) ids.add(j.id)
    }
  }

  return [...ids]
}
