import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { companies, candidates, recruiters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing CLERK_WEBHOOK_SECRET' }, { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: any

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 })
  }

  const { id } = evt.data
  const eventType = evt.type

  switch (eventType) {
    case 'user.created': {
      const { email_addresses, first_name, last_name, unsafe_metadata } = evt.data
      const role = unsafe_metadata?.role as string | undefined

      if (role === 'candidate') {
        await db.insert(candidates).values({
          firstName: first_name || '',
          lastName: last_name || '',
          email: email_addresses?.[0]?.email_address || '',
          clerkUserId: id,
        }).onConflictDoNothing()
      }
      break
    }
    case 'user.updated': {
      const { email_addresses, first_name, last_name } = evt.data
      await db.update(recruiters)
        .set({
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          email: email_addresses?.[0]?.email_address || '',
        })
        .where(eq(recruiters.userId, id))
      break
    }
    case 'user.deleted': {
      await db.delete(recruiters).where(eq(recruiters.userId, id))
      break
    }
    case 'organization.created': {
      const { name, id: clerkOrgId } = evt.data
      await db.insert(companies).values({
        clerkOrgId,
        name,
      }).onConflictDoNothing()
      break
    }
  }

  return NextResponse.json({ received: true })
}
