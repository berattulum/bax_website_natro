import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const [partners, memberships, ecosystem] = await Promise.all([
  client.fetch('count(*[_type == "partner"])'),
  client.fetch('count(*[_type == "membership"])'),
  client.fetch('*[_type == "ecosystemPage" && _id == "ecosystemPage"][0]{ _id, partnerships, networks }'),
])

console.log(
  JSON.stringify(
    {
      partners,
      memberships,
      ecosystem: ecosystem
        ? {
            _id: ecosystem._id,
            hasPartnerships: Boolean(ecosystem.partnerships),
            hasNetworks: Boolean(ecosystem.networks),
          }
        : null,
    },
    null,
    2,
  ),
)
