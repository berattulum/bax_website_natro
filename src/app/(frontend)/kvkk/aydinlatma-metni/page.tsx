import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Personal Data Protection Notice | BaX Composites',
  description: 'BaX Composites customer personal data processing retention transfer and data subject rights notice.',
  alternates: { canonical: '/kvkk/aydinlatma-metni' },
}

const dataCategories = [
  ['Kimlik', 'Ad, soyad, kimlik/pasaport bilgileri, doğum bilgileri, uyruk ve plaka bilgileri'],
  ['İletişim', 'Telefon, e-posta, adres ve KEP adresi'],
  ['Finans', 'Vergi numarası, banka ve ödeme bilgileri, fatura bilgileri'],
  ['Fiziksel mekân güvenliği', 'Güvenlik kamerası görüntüleri'],
  ['Müşteri işlemleri', 'Sipariş, talep ve şikâyet bilgileri'],
  ['Hukuki işlem', 'Yetkili kurumlarla yürütülen hukuki yazışmalardaki bilgiler'],
  ['Görsel ve işitsel kayıtlar', 'Etkinliklerde elde edilen fotoğraf ve görüntüler'],
  ['Pazarlama', 'Anket ve müşteri memnuniyeti çalışmaları kapsamında edinilen bilgiler'],
  ['Diğer kategoriler', 'Aile/yakın bilgileri, seyahat ve gerekli hâllerde sağlıkla ilgili bilgiler'],
]

export default function ClarificationPage() {
  return (
    <LegalPage
      eyebrow="MÜŞTERİ AYDINLATMA METNİ"
      title="Kişisel Verilerin Korunması"
      description="Müşteri kişisel verilerinin BaX Kompozit A.Ş. tarafından işlenmesi, saklanması ve aktarılmasına ilişkin açıklamalar."
      pdfHref="/assets/legal/bax-personal-data-clarification.pdf"
    >
      <LegalSection number="01" title="Veri sorumlusu">
        <p><strong>BaX Kompozit A.Ş.</strong>, 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat kapsamında veri sorumlusu olarak kişisel verilerinizin güvenliğine önem verir.</p>
        <div className="legal-company-data">
          <span>Vergi dairesi</span><strong>Esenler Vergi Dairesi</strong>
          <span>Vergi numarası</span><strong>4910513864</strong>
          <span>MERSİS</span><strong>0491051386400001</strong>
        </div>
      </LegalSection>

      <LegalSection number="02" title="İşlenen veri kategorileri">
        <div className="legal-data-table">
          {dataCategories.map(([title, text]) => (
            <div key={title}><strong>{title}</strong><p>{text}</p></div>
          ))}
        </div>
      </LegalSection>

      <LegalSection number="03" title="İşleme amaçları ve hukuki sebepler">
        <p>Kişisel veriler; sözleşmelerin kurulması ve yürütülmesi, mal ve hizmet satış/üretim süreçleri, finans ve muhasebe işlemleri, müşteri ilişkileri ve talep/şikâyet yönetimi, iletişim, bilgi ve fiziksel mekân güvenliği, hukuki yükümlülüklerin yerine getirilmesi, yetkili kurumlara bilgi verilmesi ve iş faaliyetlerinin yürütülmesi amaçlarıyla işlenebilir.</p>
        <p>İşleme faaliyetleri; kanunlarda açıkça öngörülme, sözleşmenin kurulması veya ifası, hukuki yükümlülüğün yerine getirilmesi ve ilgili kişinin temel haklarına zarar vermemek kaydıyla veri sorumlusunun meşru menfaati gibi hukuki sebeplere dayanabilir. Pazarlama, özel nitelikli veri veya mevzuatın gerektirdiği diğer faaliyetlerde açık rıza esas alınabilir.</p>
      </LegalSection>

      <LegalSection number="04" title="Verilerin aktarılması">
        <div className="legal-definition-grid">
          <article><h3>Yetkili kamu kurumları</h3><p>Yasal bildirimler, mahkeme veya savcılık talepleri ve mevzuattan kaynaklanan yükümlülükler.</p></article>
          <article><h3>İş ortakları</h3><p>Bankalar, mali müşavirler, sigorta ve finans hizmet sağlayıcılarıyla sözleşme ve mali süreçlerin yürütülmesi.</p></article>
          <article><h3>Tedarikçiler</h3><p>E-posta, bilgi teknolojileri, taşıma ve benzeri destek hizmetlerinin sağlanması.</p></article>
          <article><h3>Şirket paydaşları</h3><p>İş faaliyetlerinin yürütülmesi ve denetlenmesi amacıyla sınırlı aktarım.</p></article>
        </div>
      </LegalSection>

      <LegalSection number="05" title="Toplama yöntemleri">
        <p>Kişisel veriler; basılı veya elektronik formlar, sözleşmeler, e-posta yazışmaları, raporlar, etkinlikler, Wi-Fi sistemleri, güvenlik kameraları, iş ortakları ve yüz yüze görüşmeler gibi fiziksel veya elektronik yöntemlerle toplanabilir.</p>
      </LegalSection>

      <LegalSection number="06" title="İlgili kişinin hakları">
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve bilgi talep etme</li>
          <li>İşleme amacını ve verilerin amaca uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış verilerin düzeltilmesini isteme</li>
          <li>İşleme sebepleri ortadan kalkmışsa silme veya yok etme talep etme</li>
          <li>Otomatik analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Hukuka aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
        </ul>
      </LegalSection>

      <LegalSection number="07" title="Başvuru ve yanıt süresi">
        <p>Taleplerinizi KVKK Başvuru Formunu kullanarak, kimliğinizi doğrulayan belgelerle Şirket adresine veya doğrulanabilir elektronik kanallar üzerinden iletebilirsiniz. Başvurular, Şirkete ulaştığı tarihten itibaren en geç otuz gün içinde değerlendirilerek yazılı veya elektronik ortamda yanıtlanır.</p>
      </LegalSection>
    </LegalPage>
  )
}
