const url = process.env.REVALIDATION_URL || 'http://app:3000/api/internal/revalidate'
const secret = process.env.REVALIDATION_SECRET

if (!secret) throw new Error('REVALIDATION_SECRET is required.')

const tags = [
  'bax:home',
  'bax:global-settings',
  'bax:site-settings',
  'bax:expertise',
  'bax:references-list',
  'bax:memberships',
  'bax:media',
]

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-revalidation-secret': secret,
  },
  body: JSON.stringify({ tags }),
})

const body = await response.text()
if (!response.ok) throw new Error(`Cache revalidation failed (${response.status}): ${body}`)

const result = JSON.parse(body)
if (!result.revalidated || !Array.isArray(result.tags) || result.tags.length !== tags.length) {
  throw new Error(`Unexpected cache revalidation response: ${body}`)
}

console.log(`Cache revalidated successfully: ${result.tags.join(', ')}`)
