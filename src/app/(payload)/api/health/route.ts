import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: 'users' })

    return Response.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return Response.json(
      { status: 'error', database: 'unavailable', timestamp: new Date().toISOString() },
      { status: 503 },
    )
  }
}
