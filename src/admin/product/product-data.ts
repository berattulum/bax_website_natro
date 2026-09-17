export type WebsitePage = {
  title: string
  description: string
  route: string
  preview: string
  contentState: 'managed' | 'migration'
  editHref?: string
}

export const websitePages: WebsitePage[] = [
  { title: 'Ana Sayfa', description: 'Marka anlatısı ve ana içerik akışı', route: '/', preview: '/admin-previews/home.png', contentState: 'managed', editHref: '/admin/globals/home-page' },
  { title: 'Şirket Profili', description: 'Kurumsal yaklaşım ve şirket anlatısı', route: '/sirket-profili', preview: '/admin-previews/company-profile.png', contentState: 'managed', editHref: '/admin/globals/company-profile-page' },
  { title: 'Kurucu', description: 'Kurucu hikâyesi ve liderlik yaklaşımı', route: '/kurucu', preview: '/admin-previews/founder.png', contentState: 'managed', editHref: '/admin/editor/founder' },
  { title: 'Kurumsal Bilgiler', description: 'Ticari kayıtlar ve kurumsal belgeler', route: '/kurumsal-bilgiler', preview: '/admin-previews/corporate-information.png', contentState: 'managed', editHref: '/admin/editor/corporate-information' },
  { title: 'Yetkinlikler', description: 'Mühendislik ve üretim kabiliyetleri', route: '/capabilities', preview: '/admin-previews/capabilities.png', contentState: 'managed', editHref: '/admin/globals/capabilities-page' },
  { title: 'İş Ortaklıkları', description: 'Stratejik ortaklar ve referanslar', route: '/is-ortakliklari', preview: '/admin-previews/partnerships.png', contentState: 'managed', editHref: '/admin/globals/ecosystem-page' },
  { title: 'Ağlar ve Üyelikler', description: 'Sektörel ağlar ve inovasyon ekosistemi', route: '/aglar-ve-uyelikler', preview: '/admin-previews/networks.png', contentState: 'managed', editHref: '/admin/globals/ecosystem-page' },
  { title: 'Sürdürülebilirlik', description: 'Döngüsel mühendislik yaklaşımı', route: '/surdurulebilirlik', preview: '/admin-previews/sustainability.png', contentState: 'managed', editHref: '/admin/editor/sustainability' },
  { title: 'İletişim', description: 'İletişim dizini ve proje formu', route: '/iletisim', preview: '/admin-previews/contact.png', contentState: 'managed', editHref: '/admin/globals/contact-page' },
]
