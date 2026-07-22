import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export const generateMetadata = ({ params, searchParams }: any) =>
  generatePageMetadata({ config, params, searchParams })

export default function Page({ params, searchParams }: any) {
  return RootPage({ config, importMap, params, searchParams })
}
