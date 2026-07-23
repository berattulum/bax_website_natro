import './admin-brand.scss'

export default function ViewSiteAction() {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || '/'

  return (
    <a className="bax-view-site" href={siteURL} target="_blank" rel="noreferrer">
      Canlı siteyi aç
      <span aria-hidden="true">↗</span>
    </a>
  )
}
