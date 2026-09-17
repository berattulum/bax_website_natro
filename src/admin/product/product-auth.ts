import { redirect } from 'next/navigation'
import type { InitPageResult } from 'payload'

export function requireProductUser(initPageResult: InitPageResult) {
  const user = initPageResult.req.user
  if (!user) redirect('/admin/login')
  return user
}
