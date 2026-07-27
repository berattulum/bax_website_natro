import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../../../importMap'

type CollectionAdminPageProps = {
  params: Promise<{
    collectionSlug: string
    documentSegments?: string[]
  }>
  searchParams: Promise<Record<string, string | string[]>>
}

const getPayloadParams = async (
  params: CollectionAdminPageProps['params'],
) => {
  const { collectionSlug, documentSegments = [] } = await params

  return {
    segments: ['collections', collectionSlug, ...documentSegments],
  }
}

export const generateMetadata = ({
  params,
  searchParams,
}: CollectionAdminPageProps) =>
  generatePageMetadata({
    config,
    params: getPayloadParams(params),
    searchParams,
  })

export default function CollectionAdminPage({
  params,
  searchParams,
}: CollectionAdminPageProps) {
  return RootPage({
    config,
    importMap,
    params: getPayloadParams(params),
    searchParams,
  })
}
