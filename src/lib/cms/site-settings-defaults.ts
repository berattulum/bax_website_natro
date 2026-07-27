export type SiteUISettings = {
  navigation: Record<'home' | 'about' | 'expertise' | 'references' | 'memberships' | 'contact' | 'contactUs' | 'mainNavigationLabel' | 'mobileMenuLabel' | 'languageLabel', string>
  hero: {
    capabilities: string
    discuss: string
    slidesLabel: string
    slideLabel: string
    secondarySlides: Array<[string, string, string, string]>
  }
  narratives: Array<[string, string, string, string]>
  process: { label: string; steps: Array<[string, string]> }
  sections: Record<'principlesTitle' | 'solutionsLabel' | 'solutionsTitle' | 'solutionsText' | 'defense' | 'aviation' | 'selectedPartners', string>
  directory: Record<'company' | 'email' | 'phone' | 'web' | 'tellProject' | 'companyName' | 'websiteLabel' | 'websiteUrl', string>
  form: Record<'modalTitle' | 'modalIntro' | 'name' | 'company' | 'subject' | 'message' | 'consent' | 'send' | 'sending' | 'received' | 'failed' | 'closeLabel', string>
  footer: Record<'navigation' | 'headOffice' | 'branchOffice' | 'rights' | 'copyright' | 'legalNavigationLabel' | 'privacyLabel' | 'cookieLabel' | 'applicationLabel' | 'privacyUrl' | 'cookieUrl' | 'applicationUrl', string>
}

export const DEFAULT_SITE_SETTINGS: Record<'tr' | 'en', SiteUISettings> = {
  tr: {
    navigation: {
      home: 'Ana Sayfa', about: 'Hakkımızda', expertise: 'Uzmanlık', references: 'Referanslar', memberships: 'Üyelikler', contact: 'İletişim', contactUs: 'BİZE ULAŞIN',
      mainNavigationLabel: 'Ana gezinme', mobileMenuLabel: 'Menü', languageLabel: 'Dil seçimi',
    },
    hero: {
      capabilities: 'YETKİNLİKLERİMİZ', discuss: 'PROJENİZİ KONUŞALIM', slidesLabel: 'Açılış görselleri', slideLabel: 'Görsel',
      secondarySlides: [
        ['OTOMOTİV KOMPOZİT TEKNOLOJİLERİ', 'Hafiflikten Performansa', 'Karbon fiber yapısal parçalar, hafifletme çözümleri ve ölçeklenebilir üretim süreçleriyle yeni nesil mobilite projelerine mühendislik desteği sunuyoruz.', 'automotive-bg'],
        ['OTOMOTİVDE KOMPOZİT ÜRETİM', 'Malzemeden Yapısal Değere', 'Karbon fiber monokoklar ve yapısal parçalar için hassas serim, proses geliştirme ve tekrarlanabilir üretim çözümleri geliştiriyoruz.', 'manufacturing-bg'],
      ],
    },
    narratives: [
      ['MÜHENDİSLİK VE TASARIM', 'Fütüristik Çizgiler', 'Sadece fonksiyonel değil, estetik ve keskin hatlara sahip yenilikçi tasarımları gerçeğe dönüştürüyoruz.', 'futuristic-bg'],
      ['YÜKSEK TEKNOLOJİ ÜRETİM', 'Milimetrik Hassasiyet', 'İleri tasarım ve analiz araçlarıyla geliştirilen sistemlerin kusursuz fiziksel kompozit karşılıklarını üretiyoruz.', 'precision-bg'],
    ],
    process: {
      label: 'UÇTAN UCA MÜHENDİSLİK',
      steps: [
        ['Konsept', 'Gereksinimlerin ve performans hedeflerinin tanımlanması.'],
        ['Tasarım & Analiz', 'Malzeme, geometri ve yapısal performansın geliştirilmesi.'],
        ['Test & Doğrulama', 'Ürün ve proses performansının ölçülmesi ve doğrulanması.'],
        ['Endüstrileştirme', 'Tekrarlanabilir, verimli ve ölçeklenebilir üretim sistemi.'],
      ],
    },
    sections: {
      principlesTitle: 'Mühendislikten üretime tek bir hedef.', solutionsLabel: 'ÇÖZÜMLERİMİZ', solutionsTitle: 'İleri Kompozit Teknolojileri',
      solutionsText: 'Havacılık ve otomotivin geleceğini, milimetrik tasarımlar ve sürdürülebilir üretim süreçleriyle şekillendiriyoruz.',
      defense: 'Savunma Sanayii', aviation: 'Sivil Havacılık', selectedPartners: 'Seçilmiş iş ortakları ve referans kurumlar',
    },
    directory: {
      company: 'ŞİRKET', email: 'E-POSTA', phone: 'TELEFON', web: 'WEB', tellProject: 'PROJENİZİ BİZE ANLATIN',
      companyName: 'BaX Composites Inc.', websiteLabel: 'baxcomposites.com', websiteUrl: 'https://baxcomposites.com/',
    },
    form: {
      modalTitle: 'Projenizi konuşalım.', modalIntro: 'İhtiyacınızı kısaca anlatın; mesajınızı doğrudan mühendislik ekibimize iletelim.',
      name: 'Ad Soyad', company: 'Şirket', subject: 'Konu', message: 'Mesajınız', consent: 'İletişim amacıyla bilgilerimin işlenmesini kabul ediyorum.',
      send: 'MESAJI GÖNDER', sending: 'GÖNDERİLİYOR…', received: 'MESAJINIZ ALINDI', failed: 'LÜTFEN TEKRAR DENEYİN', closeLabel: 'Kapat',
    },
    footer: {
      navigation: 'Gezinme', headOffice: 'GENEL MERKEZ', branchOffice: 'ŞUBE', rights: 'Tüm hakları saklıdır.', copyright: '© 2026 BaX Composites Inc.',
      legalNavigationLabel: 'Yasal bağlantılar', privacyLabel: 'KVKK', cookieLabel: 'Çerez Politikası', applicationLabel: 'Başvuru Formu',
      privacyUrl: '/assets/legal/bax-personal-data-clarification.pdf', cookieUrl: '/assets/legal/bax-cookie-policy.pdf', applicationUrl: '/assets/legal/bax-kvkk-application-form.pdf',
    },
  },
  en: {
    navigation: {
      home: 'Home', about: 'About Us', expertise: 'Expertise', references: 'References', memberships: 'Memberships', contact: 'Contact', contactUs: 'CONTACT US',
      mainNavigationLabel: 'Main navigation', mobileMenuLabel: 'Menu', languageLabel: 'Language',
    },
    hero: {
      capabilities: 'OUR CAPABILITIES', discuss: 'DISCUSS YOUR PROJECT', slidesLabel: 'Hero slides', slideLabel: 'Slide',
      secondarySlides: [
        ['AUTOMOTIVE COMPOSITE TECHNOLOGIES', 'From Lightweighting to Performance', 'We support next-generation mobility projects with carbon-fiber structural components, lightweighting solutions and scalable manufacturing processes.', 'automotive-bg'],
        ['AUTOMOTIVE COMPOSITE MANUFACTURING', 'From Material to Structural Value', 'We develop precision layup, process development and repeatable production solutions for carbon-fiber monocoques and structural components.', 'manufacturing-bg'],
      ],
    },
    narratives: [
      ['ENGINEERING AND DESIGN', 'Futuristic Lines', 'We turn innovative designs with functional, aesthetic, and sharp lines into reality.', 'futuristic-bg'],
      ['HIGH-TECH MANUFACTURING', 'Micrometric Precision', 'We manufacture precise physical composite counterparts of systems developed with advanced design and analysis tools.', 'precision-bg'],
    ],
    process: {
      label: 'END-TO-END ENGINEERING',
      steps: [
        ['Concept', 'Definition of requirements and performance targets.'],
        ['Design & Analysis', 'Development of material, geometry and structural performance.'],
        ['Test & Verification', 'Measurement and verification of product and process performance.'],
        ['Industrialization', 'A repeatable, efficient and scalable production system.'],
      ],
    },
    sections: {
      principlesTitle: 'One objective from engineering to production.', solutionsLabel: 'OUR SOLUTIONS', solutionsTitle: 'Advanced Composite Technologies',
      solutionsText: 'We shape the future of aerospace and automotive through precision design and sustainable manufacturing.',
      defense: 'Defense Industry', aviation: 'Civil Aviation', selectedPartners: 'Selected partners and reference organizations',
    },
    directory: {
      company: 'COMPANY', email: 'EMAIL', phone: 'PHONE', web: 'WEB', tellProject: 'TELL US ABOUT YOUR PROJECT',
      companyName: 'BaX Composites Inc.', websiteLabel: 'baxcomposites.com', websiteUrl: 'https://baxcomposites.com/',
    },
    form: {
      modalTitle: "Let's discuss your project.", modalIntro: 'Tell us briefly what you need and send your message directly to our engineering team.',
      name: 'Full name', company: 'Company', subject: 'Subject', message: 'Your message', consent: 'I consent to the processing of my information for communication purposes.',
      send: 'SEND MESSAGE', sending: 'SENDING…', received: 'MESSAGE RECEIVED', failed: 'PLEASE TRY AGAIN', closeLabel: 'Close',
    },
    footer: {
      navigation: 'Navigation', headOffice: 'HEAD OFFICE', branchOffice: 'BRANCH OFFICE', rights: 'All rights reserved.', copyright: '© 2026 BaX Composites Inc.',
      legalNavigationLabel: 'Legal links', privacyLabel: 'Privacy Notice', cookieLabel: 'Cookie Policy', applicationLabel: 'Application Form',
      privacyUrl: '/assets/legal/bax-personal-data-clarification.pdf', cookieUrl: '/assets/legal/bax-cookie-policy.pdf', applicationUrl: '/assets/legal/bax-kvkk-application-form.pdf',
    },
  },
}

type UnknownRecord = Record<string, unknown>

function group(value: unknown): UnknownRecord {
  return value && typeof value === 'object' ? value as UnknownRecord : {}
}

function text(source: UnknownRecord, key: string, fallback: string) {
  const value = source[key]
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

export function normalizeSiteSettings(raw: unknown, locale: 'tr' | 'en'): SiteUISettings {
  const fallback = DEFAULT_SITE_SETTINGS[locale]
  const document = group(raw)
  const navigation = group(document.navigation)
  const hero = group(document.hero)
  const narratives = group(document.narratives)
  const process = group(document.process)
  const sections = group(document.sections)
  const directory = group(document.directory)
  const form = group(document.form)
  const footer = group(document.footer)

  const mapRecord = <T extends Record<string, string>>(source: UnknownRecord, defaults: T): T =>
    Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [key, text(source, key, value)]),
    ) as T

  return {
    navigation: mapRecord(navigation, fallback.navigation),
    hero: {
      capabilities: text(hero, 'capabilities', fallback.hero.capabilities),
      discuss: text(hero, 'discuss', fallback.hero.discuss),
      slidesLabel: text(hero, 'slidesLabel', fallback.hero.slidesLabel),
      slideLabel: text(hero, 'slideLabel', fallback.hero.slideLabel),
      secondarySlides: [
        [
          text(hero, 'slide2Eyebrow', fallback.hero.secondarySlides[0][0]),
          text(hero, 'slide2Title', fallback.hero.secondarySlides[0][1]),
          text(hero, 'slide2Description', fallback.hero.secondarySlides[0][2]),
          'automotive-bg',
        ],
        [
          text(hero, 'slide3Eyebrow', fallback.hero.secondarySlides[1][0]),
          text(hero, 'slide3Title', fallback.hero.secondarySlides[1][1]),
          text(hero, 'slide3Description', fallback.hero.secondarySlides[1][2]),
          'manufacturing-bg',
        ],
      ],
    },
    narratives: [
      [
        text(narratives, 'designEyebrow', fallback.narratives[0][0]),
        text(narratives, 'designTitle', fallback.narratives[0][1]),
        text(narratives, 'designDescription', fallback.narratives[0][2]),
        'futuristic-bg',
      ],
      [
        text(narratives, 'manufacturingEyebrow', fallback.narratives[1][0]),
        text(narratives, 'manufacturingTitle', fallback.narratives[1][1]),
        text(narratives, 'manufacturingDescription', fallback.narratives[1][2]),
        'precision-bg',
      ],
    ],
    process: {
      label: text(process, 'label', fallback.process.label),
      steps: [1, 2, 3, 4].map((step, index) => [
        text(process, `step${step}Title`, fallback.process.steps[index][0]),
        text(process, `step${step}Text`, fallback.process.steps[index][1]),
      ]),
    },
    sections: mapRecord(sections, fallback.sections),
    directory: mapRecord(directory, fallback.directory),
    form: mapRecord(form, fallback.form),
    footer: mapRecord(footer, fallback.footer),
  }
}
