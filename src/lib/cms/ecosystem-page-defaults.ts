export type EcosystemChrome = {
  partnerships: {
    eyebrow: string
    lead: string
    title: string
    description: string
    index: string
    next: string
    nextText: string
    explore: string
  }
  networks: {
    eyebrow: string
    lead: string
    title: string
    description: string
    index: string
    next: string
    nextText: string
    explore: string
  }
}

export const ecosystemPageCopy: Record<'tr' | 'en', EcosystemChrome> = {
  tr: {
    partnerships: {
      eyebrow: 'İŞ ORTAKLIKLARI',
      lead: 'Birlikte geliştiriyoruz',
      title: 'Güçlü iş birlikleriyle mühendisliği ileri taşıyoruz',
      description: 'Tasarım, malzeme teknolojileri ve ileri üretim alanlarında dünyanın farklı noktalarındaki uzman kuruluşlarla aynı mühendislik hedefi doğrultusunda çalışıyoruz.',
      index: 'Seçilmiş iş ortakları ve referans kurumlar',
      next: 'Ağlar ve Üyelikleri İnceleyin',
      nextText: 'Araştırma, ihracat ve inovasyon ekosistemindeki bağlantılarımızı keşfedin.',
      explore: 'Keşfedin',
    },
    networks: {
      eyebrow: 'AĞLAR VE ÜYELİKLER',
      lead: 'Bağlantılı bilgi',
      title: 'Bilginin, iş birliğinin ve inovasyonun içindeyiz',
      description: 'Sektörel ağlar, meslek kuruluşları, ihracat birlikleri ve uluslararası Ar-Ge programlarıyla kurduğumuz bağlar; bilgiye, iş birliğine ve yeni pazarlara erişimimizi güçlendiriyor.',
      index: 'Kurumsal ağlar ve inovasyon ekosistemi',
      next: 'İş Ortaklıklarını İnceleyin',
      nextText: 'Mühendislik ve üretim yolculuğumuzu güçlendiren stratejik iş birliklerini görün.',
      explore: 'Keşfedin',
    },
  },
  en: {
    partnerships: {
      eyebrow: 'PARTNERSHIPS',
      lead: 'Engineered together',
      title: 'Advancing engineering through strong partnerships',
      description: 'We work toward shared engineering goals with expert organizations across design, material technologies and advanced manufacturing.',
      index: 'Selected partners and reference organizations',
      next: 'Explore Networks & Memberships',
      nextText: 'Discover our connections across research, export and innovation ecosystems.',
      explore: 'Explore',
    },
    networks: {
      eyebrow: 'NETWORKS & MEMBERSHIPS',
      lead: 'Connected knowledge',
      title: 'Part of a global ecosystem of knowledge and innovation',
      description: 'Our connections with industry networks, professional organizations, exporters associations and international R&D programmes strengthen access to knowledge, collaboration and new markets.',
      index: 'Institutional networks and innovation ecosystem',
      next: 'Explore Partnerships',
      nextText: 'See the strategic collaborations supporting our engineering and manufacturing journey.',
      explore: 'Explore',
    },
  },
}
