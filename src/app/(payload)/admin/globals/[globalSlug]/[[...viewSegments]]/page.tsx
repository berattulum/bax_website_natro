import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../../../importMap'

type GlobalAdminPageProps = {
  params: Promise<{
    globalSlug: string
    viewSegments?: string[]
  }>
  searchParams: Promise<Record<string, string | string[]>>
}

const getPayloadParams = async (params: GlobalAdminPageProps['params']) => {
  const { globalSlug, viewSegments = [] } = await params

  return {
    segments: ['globals', globalSlug, ...viewSegments],
  }
}

export const generateMetadata = ({
  params,
  searchParams,
}: GlobalAdminPageProps) =>
  generatePageMetadata({
    config,
    params: getPayloadParams(params),
    searchParams,
  })

export default function GlobalAdminPage({
  params,
  searchParams,
}: GlobalAdminPageProps) {
  return RootPage({
    config,
    importMap,
    params: getPayloadParams(params),
    searchParams,
  })
}
