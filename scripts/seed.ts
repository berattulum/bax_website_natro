import path from 'node:path'
import fs from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function seed() {
const payload = await getPayload({ config })

const siteContent = {
  tr: {
    heroEyebrow: 'İLERİ KOMPOZİT MÜHENDİSLİĞİ',
    heroTitle: 'Tasarımdan <br><span>Endüstrileştirmeye</span>',
    heroDescription: 'Havacılık ve otomotiv için konsept, analiz, test, kalifikasyon ve ölçeklenebilir kompozit üretim çözümleri geliştiriyoruz.',
    aboutTitle: 'Geleceği Kompozit ile <br>Şekillendiriyoruz',
    aboutDescription: "BaX Composites, 2018 yılında İstanbul'da ileri kompozit teknolojileri alanında faaliyet göstermek üzere kurulmuş bir mühendislik ve üretim şirketidir. Kavramsal parça tasarımından yapısal analiz, test ve doğrulamaya; proses geliştirmeden endüstrileştirme ve seri üretime kadar ürün yaşam döngüsünün tamamında uçtan uca çözümler geliştiriyoruz.",
    aboutGoal: 'Havacılık, savunma, otomotiv ve ileri mobilite sektörlerinde yerli ve uluslararası iş ortaklarımıza; daha hafif, verimli ve yüksek performanslı ürünler geliştirmeleri için destek oluyoruz. Tasarım ve üretim kabiliyetlerini ileri taşırken, güvenilir ve ölçeklenebilir kompozit çözümleriyle küresel değer zincirinde kalıcı bir teknoloji ortağı olmayı hedefliyoruz.',
    visionTitle: 'Vizyon',
    visionText: 'İleri kompozit mühendisliğinde küresel ölçekte güvenilen, yenilikçi teknolojileri endüstriyel değere dönüştüren öncü bir çözüm ortağı olmak.',
    missionTitle: 'Misyon',
    missionText: 'Tasarım, analiz, doğrulama ve üretim disiplinlerini bir araya getirerek; iş ortaklarımıza hafif, dayanıklı, verimli ve ölçeklenebilir kompozit çözümleri sunmak.',
    valuesTitle: 'Değerler',
    valuesText: 'Güven, adalet, samimiyet, tutku, sorumluluk ve bilgi; tüm iş süreçlerimizin temelini oluşturur.',
    expertiseTitle: 'Uçtan uca kompozit mühendisliği yetkinlikleri',
    referencesTitle: 'Güçlü iş birlikleriyle<br>birlikte büyüyoruz.',
    referencesText: 'Kompozit teknolojileri, havacılık, otomotiv ve ileri üretim ekosistemindeki değerli kurumlarla aynı hedef doğrultusunda çalışıyoruz.',
    membershipsTitle: 'Güçlü ağların ve<br>inovasyon ekosisteminin içindeyiz.',
    membershipsText: 'Sektörel ağlar, meslek kuruluşları, ihracat birlikleri ve uluslararası Ar-Ge programlarıyla kurduğumuz bağlar; bilgiye, iş birliğine ve yeni pazarlara erişimimizi güçlendiriyor.',
    processTitle: 'Fikirden seri üretime<br>kontrollü ilerleme.',
    contactTitle: 'Bir sonraki kompozit çözümü birlikte geliştirelim.',
    contactText: 'Tasarım, analiz, kalifikasyon veya seri üretim ihtiyaçlarınız için mühendislik ekibimizle iletişime geçin.',
    email: 'info@baxcomposites.com',
    phone: '+90 (212) 565 00 08',
    headOffice: 'Yıldız Teknik Üniversitesi Teknopark\nÇifte Havuzlar Mah., Eski Londra Asfaltı Cad.\nA1 Blok No: B35, 34220 Esenler / İstanbul',
    branchOffice: 'İkitelli OSB Mah., Metal-İş Sanayi Sitesi\nNo: 17/10, 34490 Başakşehir / İstanbul',
    footerText: 'İleri kompozit mühendisliği. Tasarımdan endüstrileştirmeye.',
    seoTitle: 'BaX Composites | Geleceği Şekillendiriyoruz',
    seoDescription: 'Havacılık ve otomotiv için ileri kompozit mühendisliği, analiz, kalifikasyon ve endüstrileştirme çözümleri.',
  },
  en: {
    heroEyebrow: 'ADVANCED COMPOSITE ENGINEERING',
    heroTitle: 'From Design <br><span>to Industrialization</span>',
    heroDescription: 'We develop concept, analysis, testing, qualification, and scalable composite manufacturing solutions for aerospace and automotive.',
    aboutTitle: 'Shaping the Future <br>with Composites',
    aboutDescription: 'Founded in Istanbul in 2018, BaX Composites is an engineering and manufacturing company specializing in advanced composite technologies. We develop end-to-end solutions across the entire product lifecycle—from conceptual part design, structural analysis, testing and verification to process development, industrialization and serial production.',
    aboutGoal: 'We support domestic and international partners in aerospace, defense, automotive and advanced mobility as they develop lighter, more efficient and higher-performance products. By advancing their design and manufacturing capabilities, we aim to become a long-term technology partner in the global value chain through reliable and scalable composite solutions.',
    visionTitle: 'Vision',
    visionText: 'To become a globally trusted advanced-composites partner that transforms innovative technologies into measurable industrial value.',
    missionTitle: 'Mission',
    missionText: 'To unite design, analysis, verification and manufacturing disciplines to deliver lightweight, durable, efficient and scalable composite solutions for our partners.',
    valuesTitle: 'Values',
    valuesText: 'Trust, fairness, sincerity, passion, responsibility, and knowledge form the foundation of every process.',
    expertiseTitle: 'End-to-end composite engineering capabilities',
    referencesTitle: 'Growing together through<br>strong partnerships.',
    referencesText: 'We work toward shared goals with valued organizations across composites, aerospace, automotive, and advanced manufacturing.',
    membershipsTitle: 'Connected to strong networks<br>and the innovation ecosystem.',
    membershipsText: 'Our connections with industry networks, professional organizations, exporters associations and international R&D programmes strengthen our access to knowledge, collaboration and new markets.',
    processTitle: 'Controlled progress from concept<br>to serial production.',
    contactTitle: "Let's develop the next composite solution together.",
    contactText: 'Contact our engineering team for your design, analysis, qualification, or serial production requirements.',
    email: 'info@baxcomposites.com',
    phone: '+90 (212) 565 00 08',
    headOffice: 'Yıldız Technical University Technopark\nÇifte Havuzlar District, Eski Londra Asfaltı Avenue\nA1 Block No: B35, 34220 Esenler / Istanbul',
    branchOffice: 'İkitelli Organized Industrial Zone, Metal-İş Industrial Site\nNo: 17/10, 34490 Başakşehir / Istanbul',
    footerText: 'Advanced composite engineering. From design to industrialization.',
    seoTitle: 'BaX Composites | Shaping the Future',
    seoDescription: 'Advanced composite engineering, analysis, qualification and industrialization solutions for aerospace and automotive.',
  },
}

const expertise = [
  ['Kompozit Tasarım & Dijital Mühendislik', 'Composite Design & Digital Engineering', 'Konsept ve laminat tasarımı, CAD/CAE, sonlu elemanlar analizi, optimizasyon ve üretilebilirlik odaklı doğrulama.', 'Concept and laminate design, CAD/CAE, finite element analysis, optimization and design-for-manufacturing verification.'],
  ['Endüstrileştirme & Otomasyon', 'Industrialization & Automation', 'Proses seçimi, seri üretim hattı tasarımı, çevrim süresi iyileştirme, otomasyon ve ölçeklenebilir üretim sistemleri.', 'Process selection, serial production line design, cycle-time improvement, automation and scalable manufacturing systems.'],
  ['Malzeme & Proses İnovasyonu', 'Material & Process Innovation', 'Termoset ve termoplastik kompozitler, sürdürülebilir malzemeler, proses geliştirme ve prototip üretimi.', 'Thermoset and thermoplastic composites, sustainable materials, process development and prototype manufacturing.'],
  ['Test, Kalifikasyon & Sertifikasyon', 'Testing, Qualification & Certification', 'Mekanik test planları, yapısal doğrulama, tahribatsız muayene, ürün ve proses kalifikasyonu ile sertifikasyon dokümantasyonu.', 'Mechanical test plans, structural verification, non-destructive inspection, product and process qualification, and certification documentation.'],
  ['Takım, Makine & Ekipman', 'Tooling, Machinery & Equipment', 'Kalıp, fikstür, özel makine ve üretim ekipmanlarının tasarımı, imalatı, devreye alınması ve performans doğrulaması.', 'Design, manufacturing, commissioning and performance verification of molds, fixtures, custom machinery and production equipment.'],
  ['Mühendislik Danışmanlığı & Yetkinlik Geliştirme', 'Engineering Consulting & Capability Development', 'Teknoloji yol haritası, proses ve tedarikçi değerlendirmesi, teknik eğitim ve bilgi transferiyle kurumsal kabiliyet geliştirme.', 'Technology roadmaps, process and supplier assessments, technical training and knowledge transfer for organizational capability development.'],
]

const partners = [
  ['CTC', 'CTC · an Airbus company', 'https://ctc-composites.com/', 'logos/ctc.png'],
  ['CTRM', 'CTRM · DRB-HICOM', 'https://www.ctrm.com.my/', 'logos/ctrm.png'],
  ['Kale', 'Kale', 'https://www.kale.com.tr/', 'logos/kale.png'],
  ['Toray', 'Toray', 'https://www.toray.com/', 'logos/toray.png'],
  ['Ecoplas', 'Ecoplas', 'https://www.ecoplas.com.tr/', 'logos/ecoplas.png'],
  ['FEV', 'FEV', 'https://www.fev.com/', 'logos/fev.png'],
  ['Rimac', 'Rimac Automobili', 'https://www.rimac-automobili.com/', 'logos/rimac.png'],
  ['MAN', 'MAN', 'https://www.man.eu/', 'logos/man.png'],
  ['Lightyear', 'Lightyear', 'https://lightyear.one/', 'logos/lightyear.png'],
  ['LIST Luxembourg', 'LIST Luxembourg', 'https://www.list.lu/', 'logos/list.png'],
  ['9T Labs', '9T Labs', 'https://www.9tlabs.com/', 'logos/9t-labs.png'],
  ['EURO-COMPOSITES', 'EURO-COMPOSITES', 'https://www.euro-composites.com/en/', 'logos/euro-composites.png'],
  ['SPIRAL RTC', 'SPIRAL RTC', 'https://spiralrtc.com/', 'logos/spiral-rtc.png'],
  ['TPRC', 'TPRC', 'https://tprc.nl/', 'logos/tprc.svg'],
  ['TPAC', 'TPAC', 'https://thermoplasticcomposites.nl/', 'logos/tpac.jpg'],
  ['Addcomposites', 'Addcomposites', 'https://www.addcomposites.com/', 'logos/addcomposites.png'],
]

const memberships = [
  ['Composites United', 'SEKTÖREL AĞ', 'INDUSTRY NETWORK', 'https://composites-united.com/en/', 'logos/memberships/composites-united.png', true],
  ['M-ERA.NET', 'AR-GE AĞI', 'R&D NETWORK', 'https://www.m-era.net/', 'logos/memberships/m-era-net.png', false],
  ['TÜBİTAK', 'ARAŞTIRMA KURUMU', 'RESEARCH INSTITUTION', 'https://tubitak.gov.tr/', 'logos/memberships/tubitak.svg', false],
  ['TOBB', 'MESLEK ÜST KURULUŞU', 'BUSINESS ORGANIZATION', 'https://www.tobb.org.tr/', 'logos/memberships/tobb.jpg', false],
  ['İstanbul Ticaret Odası', 'TİCARET ODASI', 'CHAMBER OF COMMERCE', 'https://www.ito.org.tr/tr', 'logos/memberships/ito.png', false],
  ['KOSGEB', 'KOBİ DESTEK EKOSİSTEMİ', 'SME SUPPORT ECOSYSTEM', 'https://www.kosgeb.gov.tr/', 'logos/memberships/kosgeb.png', false],
  ['Türkiye İhracatçılar Meclisi', 'İHRACAT EKOSİSTEMİ', 'EXPORT ECOSYSTEM', 'https://tim.org.tr/', 'logos/memberships/tim.svg', false],
  ['SSI', 'SEKTÖR BİRLİĞİ', 'SECTOR ASSOCIATION', 'https://www.turksavunmasanayi.gov.tr/', 'logos/memberships/ssi.png', false],
  ['OAİB', 'İHRACATÇI BİRLİĞİ', 'EXPORTERS ASSOCIATION', 'https://oaib.org.tr/', 'logos/memberships/oaib.png', false],
  ['Eureka Network', 'İNOVASYON AĞI', 'INNOVATION NETWORK', 'https://www.eurekanetwork.org/', 'logos/memberships/eureka.svg', false],
]

async function uploadLogo(name: string, relativePath: string) {
  const absolutePath = path.resolve(process.cwd(), relativePath)
  const data = await fs.readFile(absolutePath)
  const extension = path.extname(relativePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  }
  return payload.create({
    collection: 'media',
    locale: 'tr',
    data: { alt: `${name} logosu` },
    file: {
      data,
      mimetype: mimeTypes[extension] || 'application/octet-stream',
      name: path.basename(relativePath),
      size: data.length,
    },
  })
}

for (const locale of ['tr', 'en'] as const) {
  const current = await payload.findGlobal({ slug: 'site-content', locale, fallbackLocale: false })
  if (!current.heroTitle) {
    await payload.updateGlobal({ slug: 'site-content', locale, data: siteContent[locale] })
  }
}

const currentLayout = await payload.findGlobal({ slug: 'site-content', locale: 'tr' })
if (!currentLayout.sectionLayout?.length) {
  await payload.updateGlobal({
    slug: 'site-content',
    locale: 'tr',
    data: {
      sectionLayout: [
        { section: 'about', enabled: true },
        { section: 'designNarrative', enabled: true },
        { section: 'expertise', enabled: true },
        { section: 'manufacturingNarrative', enabled: true },
        { section: 'process', enabled: true },
        { section: 'principles', enabled: true },
        { section: 'solutions', enabled: true },
        { section: 'partners', enabled: true },
        { section: 'memberships', enabled: true },
        { section: 'contact', enabled: true },
      ],
    },
  })
}

if ((await payload.count({ collection: 'expertise-items' })).totalDocs === 0) {
  for (const [index, [trTitle, enTitle, trDescription, enDescription]] of expertise.entries()) {
    const item = await payload.create({ collection: 'expertise-items', locale: 'tr', data: { order: index + 1, title: trTitle, description: trDescription } })
    await payload.update({ collection: 'expertise-items', id: item.id, locale: 'en', data: { title: enTitle, description: enDescription } })
  }
}

for (const [index, [name, caption, website, logoPath]] of partners.entries()) {
  const existing = await payload.find({ collection: 'partners', limit: 1, depth: 0, where: { name: { equals: name } } })
  if (existing.totalDocs === 0) {
    try {
      const logo = logoPath ? await uploadLogo(String(name), String(logoPath)) : null
      await payload.create({ collection: 'partners', locale: 'tr', data: { order: index + 1, name, caption, website, logo: logo?.id, active: true } })
    } catch (error) {
      payload.logger.warn({ err: error, msg: `${name} logosu geçerli bir görsel olmadığı için aktarılmadı.` })
    }
  } else if (!existing.docs[0]?.logo && logoPath) {
    const logo = await uploadLogo(String(name), String(logoPath))
    await payload.update({ collection: 'partners', id: existing.docs[0].id, locale: 'tr', data: { logo: logo.id } })
  }
}

if ((await payload.count({ collection: 'memberships' })).totalDocs === 0) {
  for (const [index, [name, trCategory, enCategory, website, logoPath, darkCard]] of memberships.entries()) {
    const logo = await uploadLogo(String(name), String(logoPath))
    const item = await payload.create({ collection: 'memberships', locale: 'tr', data: { order: index + 1, name, category: trCategory, website, logo: logo.id, darkCard, active: true } })
    await payload.update({ collection: 'memberships', id: item.id, locale: 'en', data: { category: enCategory } })
  }
}

payload.logger.info('BaX başlangıç içerikleri hazır.')
}

await seed()
