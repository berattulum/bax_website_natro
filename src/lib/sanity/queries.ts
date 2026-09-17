export const homeBundleQuery = `{
  "siteContent": *[_type == "siteContent" && _id == "siteContent"][0],
  "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0],
  "expertise": *[_type == "expertiseItem"] | order(order asc),
  "partners": *[_type == "partner" && active != false] | order(order asc),
  "memberships": *[_type == "membership" && active != false] | order(order asc)
}`

export const managedPageQuery = `*[_type == $type && _id == $id][0]{
  contentTr,
  contentEn,
  records,
  offices
}`

export const MANAGED_PAGE_MAP = {
  'founder-page': { type: 'founderPage', id: 'founderPage' },
  'corporate-information-page': { type: 'corporateInformationPage', id: 'corporateInformationPage' },
  'sustainability-page': { type: 'sustainabilityPage', id: 'sustainabilityPage' },
  'company-profile-page': { type: 'companyProfilePage', id: 'companyProfilePage' },
  'home-page': { type: 'homePage', id: 'homePage' },
  'capabilities-page': { type: 'capabilitiesPage', id: 'capabilitiesPage' },
  'ecosystem-page': { type: 'ecosystemPage', id: 'ecosystemPage' },
  'contact-page': { type: 'contactPage', id: 'contactPage' },
} as const
