import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('BaX Content')
    .items([
      S.listItem()
        .title('Ecosystem Pages')
        .id('ecosystemPage')
        .child(S.document().schemaType('ecosystemPage').documentId('ecosystemPage').title('Partnerships & Networks copy')),
      S.divider(),
      S.documentTypeListItem('partner').title('Partners (İş Ortaklıkları)'),
      S.documentTypeListItem('membership').title('Memberships (Ağlar ve Üyelikler)'),
      S.divider(),
      S.documentTypeListItem('expertiseItem').title('Expertise'),
    ])
