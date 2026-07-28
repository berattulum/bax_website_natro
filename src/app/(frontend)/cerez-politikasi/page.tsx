import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Çerez Politikası | BaX Composites',
  description: 'BaX Composites web sitesi çerez politikası.',
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="WEB SİTESİ POLİTİKASI"
      title="Çerez Politikası"
      description="Web sitemizde kullanılan çerezlerin amaçları, türleri ve tercihlerinizi nasıl yönetebileceğiniz hakkında bilgi."
      pdfHref="/assets/legal/bax-cookie-policy.pdf"
    >
      <LegalSection number="01" title="Politikanın amacı">
        <p>BaX Kompozit A.Ş. (“Şirket”), www.baxcomposites.com adresindeki çevrim içi kanalların kullanımı sırasında kullanıcı deneyimini kişiselleştirmek amacıyla çerezlerden yararlanabilir.</p>
        <p>Çerezler, web sunucusu tarafından tarayıcınız aracılığıyla cihazınıza gönderilen küçük veri parçalarıdır. Bu politika, site ziyaretleri sırasında çerezler vasıtasıyla elde edilebilecek kişisel veriler hakkında bilgi vermek amacıyla hazırlanmıştır.</p>
      </LegalSection>

      <LegalSection number="02" title="Çerez türleri">
        <div className="legal-definition-grid">
          <article><h3>Oturum çerezleri</h3><p>Web sitesinin işlevlerinin doğru çalışmasını, sayfalar arasında bilgi aktarımını ve tekrarlanan veri girişlerinin önlenmesini destekleyen geçici çerezlerdir.</p></article>
          <article><h3>Performans çerezleri</h3><p>Ziyaret sıklığı, sayfalarda geçirilen süre, gezinme biçimi ve varsa hata mesajları gibi bilgilerin değerlendirilmesine yardımcı olabilir.</p></article>
          <article><h3>İşlevsel çerezler</h3><p>Kullanıcının yaptığı seçimlerin ve tercihlerin hatırlanmasını, gelişmiş site özelliklerinin sunulmasını sağlar.</p></article>
          <article><h3>Reklam ve üçüncü taraf çerezleri</h3><p>Sosyal paylaşım araçları gibi üçüncü taraf işlevleri ile reklam ölçüm veya takip faaliyetlerinde kullanılabilecek çerezlerdir.</p></article>
        </div>
      </LegalSection>

      <LegalSection number="03" title="Kullanım amaçları ve aktarım">
        <p>Çerez teknolojileri; web sitesinin çalışması, ziyaretçi tercihlerinin hatırlanması, performansın ölçülmesi ve çevrim içi hizmetlerin geliştirilmesi amaçlarıyla kullanılabilir.</p>
        <p>Kişisel veriler, mevzuata ve işleme amacına uygun şekilde, gerekli durumlarda tedarikçiler ve kanunen yetkili kamu kurumlarıyla sınırlı olarak paylaşılabilir. Üçüncü taraf hizmet sağlayıcıların sunucuları farklı ülkelerde bulunabilir.</p>
      </LegalSection>

      <LegalSection number="04" title="Çerez tercihlerini yönetme">
        <p>Tarayıcı ayarlarınız üzerinden çerezleri engelleyebilir, çerez gönderilmeden önce uyarı almayı seçebilir veya daha önce kaydedilmiş çerezleri silebilirsiniz. Tercihler her cihaz ve tarayıcı için ayrı ayrı yapılmalıdır.</p>
        <ul>
          <li>Google reklam tercihleri ve reklam kişiselleştirme ayarları</li>
          <li>Google Analytics devre dışı bırakma seçenekleri</li>
          <li>Chrome ve diğer tarayıcıların çerez yönetimi ayarları</li>
          <li>Mobil cihazların gizlilik ve site verisi ayarları</li>
        </ul>
      </LegalSection>

      <LegalSection number="05" title="İlgili kişi hakları">
        <p>6698 sayılı Kanun’un 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme, aktarılan üçüncü kişileri bilme, düzeltme veya silme talep etme, otomatik analiz sonucu aleyhinize bir sonuca itiraz etme ve hukuka aykırı işleme nedeniyle zararın giderilmesini isteme haklarına sahipsiniz.</p>
        <p>Bu haklara ilişkin taleplerinizi KVKK başvuru sayfasında açıklanan yöntemlerle Şirkete iletebilirsiniz.</p>
      </LegalSection>
    </LegalPage>
  )
}
