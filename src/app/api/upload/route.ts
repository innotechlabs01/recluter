import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { candidates, documents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: PDF, JPG, PNG' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size: 5MB' },
      { status: 400 }
    )
  }

  const fileName = `${userId}/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('documents')
    .upload(fileName, file)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Persist the document row so /api/candidato/documents lists it.
  let documentId: string | null = null
  const [candidate] = await db
    .select({ id: candidates.id })
    .from(candidates)
    .where(eq(candidates.clerkUserId, userId))
  if (candidate) {
    const [doc] = await db
      .insert(documents)
      .values({
        candidateId: candidate.id,
        filename: file.name,
        url: urlData.publicUrl,
        type: file.type,
      })
      .returning({ id: documents.id })
    documentId = doc.id
  }

  return NextResponse.json({
    id: documentId,
    url: urlData.publicUrl,
    filename: file.name,
    type: file.type,
  })
}
