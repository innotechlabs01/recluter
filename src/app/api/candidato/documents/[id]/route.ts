import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { candidates, documents } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

// DELETE /api/candidato/documents/[id] — delete own document.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [candidate] = await db
    .select({ id: candidates.id })
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))
  if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })

  const [deleted] = await db
    .delete(documents)
    .where(and(eq(documents.id, id), eq(documents.candidateId, candidate.id)))
    .returning({ id: documents.id })
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
