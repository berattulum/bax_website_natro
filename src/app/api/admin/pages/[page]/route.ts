import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { editorPages, type EditorPageKey } from '@/admin/product/editor-config'

export async function POST(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  const { page } = await params
  const pageKey = page as EditorPageKey
  const definition = editorPages[pageKey]
  if (!definition) return NextResponse.json({ error: 'Sayfa bulunamadı' }, { status: 404 })

  const body = await request.json() as { locale?: 'tr' | 'en'; content?: Record<string, unknown>; status?: 'draft' | 'published' }
  if (!body.locale || !body.content || !body.status) return NextResponse.json({ error: 'Eksik veri' }, { status: 400 })

  await payload.updateGlobal({
    slug: definition.slug,
    data: { [body.locale === 'tr' ? 'contentTr' : 'contentEn']: body.content, _status: body.status },
    overrideAccess: false,
    user,
  })
  revalidatePath(definition.route)
  return NextResponse.json({ ok: true })
}
