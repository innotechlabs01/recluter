import { db } from './index'
import { companies, jobRequests, candidates } from './schema'

async function testConnection() {
  try {
    // Test basic query
    const result = await db.select().from(companies).limit(1)
    console.log('✅ Connection successful!')
    console.log('Companies table accessible:', result.length >= 0 ? 'Yes' : 'No')

    // Test job_requests table
    const jr = await db.select().from(jobRequests).limit(1)
    console.log('Job requests table accessible:', jr.length >= 0 ? 'Yes' : 'No')

    // Test candidates table
    const cand = await db.select().from(candidates).limit(1)
    console.log('Candidates table accessible:', cand.length >= 0 ? 'Yes' : 'No')

    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  }
}

testConnection()
