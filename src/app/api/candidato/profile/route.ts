import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { resolveAuth, isE2eBypass } from '@/lib/test-auth'
import { db } from '@/lib/db'
import { candidates, candidateProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/candidato/profile - Get current candidate profile
export async function GET() {
  const { userId } = await resolveAuth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))

  if (!candidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  const [profile] = await db
    .select()
    .from(candidateProfiles)
    .where(eq(candidateProfiles.candidateId, candidate.id))

  return NextResponse.json({ candidate, profile: profile ?? null })
}

// PUT /api/candidato/profile - Upsert candidate + candidate_profile
// Self-heals the sign-up webhook timing gap: `user.created` fires before the
// role is set, so the candidate row may not exist yet. We insert it on demand.
export async function PUT(req: Request) {
  const { userId } = await resolveAuth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const user = isE2eBypass() ? null : await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? body.email ?? `e2e-${userId}@test.local`

  // 1. Ensure the candidate row exists (upsert by clerk user id).
  let [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))

  if (!candidate) {
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'firstName and lastName are required' },
        { status: 400 }
      )
    }
    ;[candidate] = await db
      .insert(candidates)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: email || '',
        phone: body.phone || null,
        clerkUserId: userId,
        status: 'available',
      })
      .returning()
  } else {
    ;[candidate] = await db
      .update(candidates)
      .set({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone ?? candidate.phone,
        email: email || candidate.email,
      })
      .where(eq(candidates.id, candidate.id))
      .returning()
  }

  // 2. Upsert the candidate profile (bio = experience, skills = skills).
  const [existingProfile] = await db
    .select()
    .from(candidateProfiles)
    .where(eq(candidateProfiles.candidateId, candidate.id))

  let profile
  if (existingProfile) {
    ;[profile] = await db
      .update(candidateProfiles)
      .set({
        bio: body.experience,
        skills: body.skills ? [body.skills] : existingProfile.skills,
      })
      .where(eq(candidateProfiles.id, existingProfile.id))
      .returning()
  } else {
    ;[profile] = await db
      .insert(candidateProfiles)
      .values({
        candidateId: candidate.id,
        bio: body.experience,
        skills: body.skills ? [body.skills] : null,
      })
      .returning()
  }

  return NextResponse.json({ candidate, profile })
}
