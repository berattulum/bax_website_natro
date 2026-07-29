import type { Metadata } from 'next'
import { LegalPage, LegalSection } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Kurumsal Bilgiler | BaX Composites',
  description: 'BaX Kompozit A.Ş. ticari unvan, MERSİS, vergi, D-U-N-S ve ticaret sicil bilgileri.',
}

const companyRecords = [
  ['Ticari unvan', 'BaX Kompozit A.Ş. / BaX Composites Inc.'],
  ['MERSİS numarası', '0491051386400001'],
  ['Vergi dairesi', 'Esenler Vergi Dairesi / İstanbul'],
  ['Vergi numarası', '4910513864'],
  ['D-U-N-S numarası', '595606606'],
  ['Ticaret sicil numarası', '156004-5'],
  ['Ödenmiş sermaye', '1.800.000,00 TL'],
]

export default function CorporateInformationPage() {
  return (
    <LegalPage
      eyebrow="KURUMSAL ŞEFFAFLIK"
      title="Kurumsal Bilgiler"
      description="BaX Kompozit A.Ş.’nin ticari kimliği ve doğrulanabilir kurumsal kayıt bilgileri."
      asideTitle="Resmî kayıt"
      asideDescription="Şirket kaydını Merkezi Kayıt Kuruluşu e-Şirket Bilgi Portalı üzerinden görüntüleyebilirsiniz."
      externalHref="https://e-sirket.mkk.com.tr/?page=company&company=10566#"
      externalLabel="MKK kaydını doğrula"
      metaTitle="Kurumsal kayıt özeti"
      metaDescription="Sunum amaçlıdır; nihai yayından önce güncel resmî kayıtlarla teyit edilecektir."
    >
      <LegalSection number="01" title="Ticari kimlik">
        <div className="legal-company-data corporate-records">
          {companyRecords.map(([label, value]) => (
            <div key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </LegalSection>

      <LegalSection number="02" title="Merkez ve iletişim">
        <div className="legal-definition-grid">
          <article>
            <h3>Genel merkez</h3>
            <p>Yıldız Teknik Üniversitesi Teknopark, Çifte Havuzlar Mah., Eski Londra Asfaltı Cad., A1 Blok No: B35, 34220 Esenler / İstanbul</p>
          </article>
          <article>
            <h3>Şube</h3>
            <p>İkitelli OSB Mah., Metal-İş Sanayi Sitesi, No: 17/10, 34490 Başakşehir / İstanbul</p>
          </article>
        </div>
        <div className="legal-callout">
          <p><strong>E-posta:</strong> info@baxcomposites.com &nbsp; <strong>Telefon:</strong> +90 (212) 565 00 08</p>
        </div>
      </LegalSection>

      <LegalSection number="03" title="Kayıt doğrulama">
        <p>Şirketin kamuya açık kayıt bilgileri MKK e-Şirket Bilgi Portalı üzerinden doğrulanabilir. Sicil, sermaye veya adres bilgilerinde değişiklik olması hâlinde bu sayfa güncel resmî kayıtlar esas alınarak yenilenir.</p>
        <a className="legal-inline-download" href="https://e-sirket.mkk.com.tr/?page=company&company=10566#" target="_blank" rel="noreferrer">
          MKK şirket sayfasını aç <span aria-hidden="true">↗</span>
        </a>
      </LegalSection>
    </LegalPage>
  )
}
