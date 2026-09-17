export type EditorGroup = { title: string; description: string; keys: readonly string[] }

export const editorPages = {
  founder: {
    title: 'Kurucu', slug: 'founder-page', route: '/kurucu',
    groups: [
      { title: 'Açılış alanı', description: 'İsim, rol ve sayfanın giriş anlatısı.', keys: ['eyebrow', 'role', 'intro'] },
      { title: 'Liderlik profili', description: 'Profil başlığı ve deneyim maddeleri.', keys: ['focusLabel', 'focusTitle', 'facts'] },
      { title: 'Doğrulanmış kaynaklar', description: 'Sayfanın altındaki kaynak bağlantılarının metinleri.', keys: ['sources', 'mach', 'loco', 'sampe', 'linkedin'] },
    ],
  },
  'corporate-information': {
    title: 'Kurumsal Bilgiler', slug: 'corporate-information-page', route: '/kurumsal-bilgiler',
    groups: [
      { title: 'Açılış alanı', description: 'Sayfanın ana başlığı ve kısa açıklaması.', keys: ['eyebrow', 'title', 'titleAccent', 'intro'] },
      { title: 'Bölüm başlıkları', description: 'Şirket kayıtları ve operasyon noktaları.', keys: ['identity', 'offices', 'head', 'branch'] },
      { title: 'Resmî doğrulama', description: 'MKK doğrulama alanının metinleri.', keys: ['verify', 'verifyText', 'verifyLink', 'legal'] },
    ],
  },
  sustainability: {
    title: 'Sürdürülebilirlik', slug: 'sustainability-page', route: '/surdurulebilirlik',
    groups: [
      { title: 'Açılış alanı', description: 'İlk ekran başlığı, açıklaması ve yönlendirmesi.', keys: ['heroKicker', 'heroTitle', 'heroText', 'heroCta', 'nav'] },
      { title: 'Yaklaşım', description: 'Yaşam döngüsü yaklaşımı ve temel ilkeler.', keys: ['approachKicker', 'approachTitle', 'approachLead', 'approachText', 'principles'] },
      { title: 'Odak alanları', description: 'Sürdürülebilirlik programının üç ana odağı.', keys: ['focusKicker', 'focusTitle', 'focusText', 'focus'] },
      { title: 'Kompozitlerin etkisi', description: 'Ürün performansı ve operasyon yaklaşımı.', keys: ['enableKicker', 'enableTitle', 'enableText', 'enableNote', 'operationsKicker', 'operationsTitle', 'operationsText', 'platforms'] },
      { title: 'Döngüsellik', description: 'Malzemenin sonraki yaşamına uzanan süreç.', keys: ['circularKicker', 'circularTitle', 'circularText', 'journey'] },
      { title: 'Kanıt ve hedefler', description: 'LCA yaklaşımı ve ortak sürdürülebilirlik hedefleri.', keys: ['evidenceKicker', 'evidenceTitle', 'evidenceText', 'evidenceStages', 'evidenceNote', 'goalsKicker', 'goalsTitle', 'goalsText', 'goals', 'disclaimer'] },
      { title: 'Kapanış', description: 'Sayfanın son mesajı ve iletişim çağrısı.', keys: ['closingKicker', 'closingTitle', 'closingText', 'closingCta'] },
    ],
  },
} as const

export type EditorPageKey = keyof typeof editorPages
