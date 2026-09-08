import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { chatThreads, companies, jobRequests, recruiters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { resolveRole } from './role'

export type ChatActor = 'recruiter' | 'company' | 'admin'

export class ChatAccessError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface ThreadAccess {
  threadId: string
  jobRequestId: string
  actor: ChatActor
  userId: string
}

/**
 * Grants chat access to the assigned recruiter, the owning company, or an
 * admin. Throws ChatAccessError when denied.
 */
export async function assertThreadAccess(threadId: string): Promise<ThreadAccess> {
  const { userId, orgId } = await auth()
  if (!userId) throw new ChatAccessError(401, 'Unauthorized')

  const [thread] = await db.select().from(chatThreads).where(eq(chatThreads.id, threadId))
  if (!thread || !thread.jobRequestId) throw new ChatAccessError(404, 'Thread not found')

  const [job] = await db.select().from(jobRequests).where(eq(jobRequests.id, thread.jobRequestId))
  if (!job) throw new ChatAccessError(404, 'Thread not found')

  const actor = await resolveChatActor(userId, orgId, job.recruiterId, job.companyId)
  if (!actor) throw new ChatAccessError(403, 'Forbidden')

  return { threadId, jobRequestId: thread.jobRequestId, actor, userId }
}

export interface JobAccess {
  actor: ChatActor
  userId: string
}

/** Same rule as threads, but scoped to a job request (for listing/creating). */
export async function assertJobChatAccess(jobId: string): Promise<JobAccess> {
  const { userId, orgId } = await auth()
  if (!userId) throw new ChatAccessError(401, 'Unauthorized')

  const [job] = await db.select().from(jobRequests).where(eq(jobRequests.id, jobId))
  if (!job) throw new ChatAccessError(404, 'Job request not found')

  const actor = await resolveChatActor(userId, orgId, job.recruiterId, job.companyId)
  if (!actor) throw new ChatAccessError(403, 'Forbidden')

  return { actor, userId }
}

async function resolveChatActor(
  userId: string,
  orgId: string | null | undefined,
  jobRecruiterId: string | null,
  jobCompanyId: string | null
): Promise<ChatActor | null> {
  const user = await currentUser()
  if (resolveRole(user) === 'admin') return 'admin'

  if (jobRecruiterId) {
    const [recruiter] = await db.select().from(recruiters).where(eq(recruiters.id, jobRecruiterId))
    if (recruiter?.userId === userId) return 'recruiter'
  } else {
    // Unassigned job: any active recruiter may follow up.
    const [recruiter] = await db.select().from(recruiters).where(eq(recruiters.userId, userId))
    if (recruiter?.isActive) return 'recruiter'
  }

  if (orgId && jobCompanyId) {
    const [company] = await db.select().from(companies).where(eq(companies.clerkOrgId, orgId))
    if (company && company.id === jobCompanyId) return 'company'
  }

  return null
}
