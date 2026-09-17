export default {
  poweredByHeader: false,
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.44'],
  reactCompiler: false,
  images: {
    qualities: [75, 95, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
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
}
