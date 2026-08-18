import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Data Subject Application Form | BaX Composites',
  description: 'Application methods and form for exercising personal data rights in relation to BaX Composites.',
  alternates: { canonical: '/kvkk/basvuru' },
}

export default function KvkkApplicationPage() {
  return (
    <LegalPage
      eyebrow="6698 SAYILI KANUN"
      title="KVKK Başvuru Formu"
      description="Kişisel verilerinize ilişkin haklarınızı kullanmak üzere BaX Kompozit A.Ş.’ye yapacağınız başvurular için yöntem ve açıklamalar."
      pdfHref="/assets/legal/bax-kvkk-application-form.pdf"
    >
      <LegalSection number="01" title="Formun amacı">
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 11. maddesi kapsamında kişisel veri sahiplerine, kişisel verilerinin işlenmesine ilişkin belirli haklar tanınmıştır. Bu form, bilgi edinme ve diğer ilgili kişi haklarının Şirkete yapılacak başvuru yoluyla kullanılmasını kolaylaştırmak amacıyla hazırlanmıştır.</p>
      </LegalSection>

      <LegalSection number="02" title="Başvuru yöntemleri">
        <div className="legal-methods">
          <article><span>01</span><h3>Şahsen başvuru</h3><p>Kimliğinizi doğrulayan belgelerle şirket adresine şahsen başvurabilirsiniz.</p></article>
          <article><span>02</span><h3>Noter veya iadeli taahhütlü posta</h3><p>Başvuru evrakınızı noter aracılığıyla veya teslimatı kanıtlanabilir posta yöntemiyle iletebilirsiniz.</p></article>
          <article><span>03</span><h3>Kayıtlı e-posta adresi</h3><p>Şirket sisteminde daha önce kayıtlı ve size ait olduğu doğrulanabilen e-posta adresinizden info@baxcomposites.com adresine başvurabilirsiniz.</p></article>
        </div>
        <p className="legal-callout">Zarfın veya e-postanın konu bölümüne “Kişisel Verilerin Korunması Kanunu Kapsamında Bilgi Talebi” yazılması önerilmektedir.</p>
      </LegalSection>

      <LegalSection number="03" title="Başvuruda bulunması gereken bilgiler">
        <ul>
          <li>Ad ve soyadı</li>
          <li>T.C. kimlik numarası veya yabancılar için pasaport/kimlik numarası</li>
          <li>Telefon numarası ve e-posta adresi</li>
          <li>Tebligata esas ikametgâh veya iş yeri adresi</li>
          <li>Şirketle ilişkiniz ve iletişim kurduğunuz kişi veya birim</li>
          <li>Talebinizin açık ve ayrıntılı açıklaması</li>
          <li>Varsa talebi destekleyen bilgi ve belgeler</li>
        </ul>
      </LegalSection>

      <LegalSection number="04" title="Yanıt ve bildirim">
        <p>Başvurular, başvurunun Şirkete ulaşmasından itibaren niteliğine göre en kısa sürede ve en geç otuz gün içinde değerlendirilir. Yanıt; başvuruda tercih edilen yönteme göre e-posta, kayıtlı posta, noter veya elden teslim yoluyla iletilebilir.</p>
        <p>Kimlik doğrulaması veya talebin değerlendirilmesi için gerekli olması hâlinde ek bilgi ve belge istenebilir. Yetkisiz kişiler tarafından yapılan veya doğrulanamayan başvurular işleme alınmayabilir.</p>
      </LegalSection>

      <LegalSection number="05" title="Formu doldurma">
        <p>Kaynak PDF; başvuru sahibinin iletişim bilgileri, talebi, ekleri, yanıt tercihi, tarih ve imza alanlarını içerir. Formu indirip doldurduktan sonra yukarıdaki yöntemlerden biriyle Şirkete iletebilirsiniz.</p>
        <a className="legal-inline-download" href="/assets/legal/bax-kvkk-application-form.pdf" target="_blank" rel="noreferrer">Başvuru formunu PDF olarak indir <span aria-hidden="true">↓</span></a>
      </LegalSection>
    </LegalPage>
  )
}
