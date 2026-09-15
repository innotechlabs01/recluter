// supabase/migrate-existing-users.ts
// Run once after deploy: npx tsx supabase/migrate-existing-users.ts

import { clerkClient } from '@clerk/nextjs/server'
import { db } from '../src/lib/db'
import { userRoles } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

async function migrateExistingUsers() {
  const client = await clerkClient()

  // Paginate through all users
  let hasMore = true
  let offset = 0
  const limit = 100

  while (hasMore) {
    const users = await client.users.getUserList({ limit, offset })

    for (const user of users.data) {
      const role = user.unsafeMetadata?.role
      if (typeof role === 'string' && ['company', 'candidate', 'admin', 'recruiter'].includes(role)) {
        // Check if already migrated
        const existing = await db
          .select()
          .from(userRoles)
          .where(eq(userRoles.clerkUserId, user.id))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(userRoles).values({
            clerkUserId: user.id,
            role,
            status: 'approved',
          })
          console.log(`Migrated user ${user.id} -> ${role}`)
        }
      }
    }

    hasMore = users.data.length === limit
    offset += limit
  }

  console.log('Migration complete')
}

migrateExistingUsers().catch(console.error)
