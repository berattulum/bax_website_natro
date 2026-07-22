import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  allowedDevOrigins: ['192.168.1.44'],
  reactCompiler: false,
  turbopack: {
    root: process.cwd(),
  },
})
