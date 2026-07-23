import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  allowedDevOrigins: ['192.168.1.44'],
  reactCompiler: false,
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/ucak-video.mp4',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  turbopack: {
    root: process.cwd(),
  },
})
