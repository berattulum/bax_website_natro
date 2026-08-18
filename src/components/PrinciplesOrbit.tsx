type PrinciplesDictionary = {
  visionTitle: string
  missionTitle: string
  valuesTitle: string
}

export function PrinciplesOrbit({ lang, dictionary: d }: { lang: 'tr' | 'en'; dictionary: PrinciplesDictionary }) {
  const cards = lang === 'tr' ? [
    { title: d.visionTitle, items: [<>Küresel ölçekte <strong>güvenilir teknoloji ortağı</strong> olmak</>, <>Yenilikçi teknolojileri <strong>ölçülebilir endüstriyel değere</strong> dönüştürmek</>, <><strong>Sürdürülebilir kompozit çözümlerle</strong> geleceğin üretimine yön vermek</>] },
    { title: d.missionTitle, items: [<><strong>Tasarım, analiz ve doğrulamayı</strong> tek sistemde birleştirmek</>, <>Hafif, dayanıklı ve <strong>ölçeklenebilir üretim</strong> çözümleri sunmak</>, <><strong>Sürdürülebilirliği</strong> malzeme seçiminden seri üretime taşımak</>] },
    { title: d.valuesTitle, items: [<><strong>Güven, adalet ve samimiyet</strong></>, <><strong>Tutku, sorumluluk ve bilgi</strong></>, <>Kaynak verimliliği ve <strong>sürdürülebilirlik</strong></>] },
  ] : [
    { title: d.visionTitle, items: [<>Become a globally <strong>trusted technology partner</strong></>, <>Transform innovative technologies into <strong>measurable industrial value</strong></>, <>Shape future manufacturing through <strong>sustainable composite solutions</strong></>] },
    { title: d.missionTitle, items: [<>Unite <strong>design, analysis and verification</strong> in one system</>, <>Deliver lightweight, durable and <strong>scalable manufacturing</strong> solutions</>, <>Carry <strong>sustainability</strong> from material selection into serial production</>] },
    { title: d.valuesTitle, items: [<><strong>Trust, fairness and sincerity</strong></>, <><strong>Passion, responsibility and knowledge</strong></>, <>Resource efficiency and <strong>sustainability</strong></>] },
  ]

  return <section className="principles-orbit scroll-reveal" aria-labelledby="principles-orbit-title">
    <div className="principles-orbit-grid" aria-hidden="true" />
    <div className="principles-orbit-horizon" aria-hidden="true"><i /><i /><i /></div>
    <div className="principles-orbit-scan" aria-hidden="true" />
    <div className="container principles-orbit-inner">
      <header className="principles-orbit-heading">
        <h2 id="principles-orbit-title">{lang === 'tr'
          ? <>Geleceği malzemeden<br /><strong>mühendisliğe taşıyoruz</strong></>
          : <>From material potential<br /><strong>to engineered futures</strong></>}</h2>
      </header>
      <div className="principles-orbit-path" aria-hidden="true"><i /><i /><i /></div>
      <div className="principles-orbit-items principles-orbit-items-revised">
        {cards.map(({ title, items }, index) => <article key={title}>
          <h3>{title}</h3>
          <ul>{items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
        </article>)}
      </div>
    </div>
  </section>
}
