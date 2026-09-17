import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('BaX Content')
    .items([
      S.documentTypeListItem('expertiseItem').title('Expertise'),
      S.documentTypeListItem('partner').title('Partners'),
      S.documentTypeListItem('membership').title('Memberships'),
    ])
