import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { processEvents } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

// GET /api/solicitudes/[id]/events — timeline events for a process.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const rows = await db
    .select()
    .from(processEvents)
    .where(eq(processEvents.jobRequestId, id))
    .orderBy(asc(processEvents.createdAt))

  return NextResponse.json(rows)
}
