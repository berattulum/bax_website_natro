import type { StructureResolver } from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string, type: string) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(type).documentId(id).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('BaX Content')
    .items([
      singleton(S, 'siteContent', 'Site Content', 'siteContent'),
      singleton(S, 'siteSettings', 'Site Settings', 'siteSettings'),
      S.divider(),
      singleton(S, 'homePage', 'Home Page', 'homePage'),
      singleton(S, 'companyProfilePage', 'Company Profile', 'companyProfilePage'),
      singleton(S, 'founderPage', 'Founder', 'founderPage'),
      singleton(S, 'corporateInformationPage', 'Corporate Information', 'corporateInformationPage'),
      singleton(S, 'sustainabilityPage', 'Sustainability', 'sustainabilityPage'),
      singleton(S, 'capabilitiesPage', 'Capabilities', 'capabilitiesPage'),
      singleton(S, 'ecosystemPage', 'Ecosystem', 'ecosystemPage'),
      singleton(S, 'contactPage', 'Contact Page', 'contactPage'),
      S.divider(),
      S.documentTypeListItem('expertiseItem').title('Expertise'),
      S.documentTypeListItem('partner').title('Partners'),
      S.documentTypeListItem('membership').title('Memberships'),
    ])
