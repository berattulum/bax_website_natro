import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'

import EditorForm from './EditorForm'
import ProductShell from './ProductShell'
import { editorPages, type EditorPageKey } from './editor-config'
import { requireProductUser } from './product-auth'

export default async function EditorView({ initPageResult, params }: AdminViewServerProps) {
  const user = requireProductUser(initPageResult)
  const pageKey = params?.page as EditorPageKey
  const definition = editorPages[pageKey]
  if (!definition) redirect('/admin/pages')
  const page = await initPageResult.req.payload.findGlobal({ slug: definition.slug, depth: 0, draft: true, overrideAccess: false, req: initPageResult.req })

  return <ProductShell userEmail={user.email}><main className="bx-screen bx-editor"><header className="bx-screen__heading bx-screen__heading--split"><div><span>Sayfa editörü</span><h1>{definition.title}</h1><p>Alanlar ziyaretçinin sayfada gördüğü sırayla düzenlenmiştir.</p></div><a className="bx-primary-link" href={definition.route} rel="noreferrer" target="_blank">Sayfayı görüntüle ↗</a></header><EditorForm pageKey={pageKey} groups={definition.groups} initialTr={page.contentTr as Record<string, unknown>} initialEn={page.contentEn as Record<string, unknown>} /></main></ProductShell>
}
