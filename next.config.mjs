import { withPayload } from '@payloadcms/next/withPayload'

const isDockerBuild = process.env.DOCKER_BUILD === '1' || process.env.OUTPUT_STANDALONE === '1'

export default withPayload({
  // Standalone is for Docker/Natro images only. Vercel uses its own bundler.
  ...(isDockerBuild ? { output: 'standalone' } : {}),
  poweredByHeader: false,
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.44'],
  reactCompiler: false,
  images: {
    qualities: [75, 95],
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.cloudflarestorage.com' },
    ],
  },
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
