'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type PreviewMode = 'desktop' | 'mobile'
type PreviewLanguage = 'tr' | 'en'

type EditableSection = {
  key: string
  label: string
  description: string
  href: string
  location: string
}

const editableSections: EditableSection[] = [
  {
    key: 'hero',
    label: 'Açılış slider alanı',
    description: 'Üst başlık, ana başlık ve açılış açıklaması.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Ana Sayfa',
  },
  {
    key: 'about',
    label: 'Hakkımızda',
    description: 'Kurumsal başlık, şirket tanıtımı ve hedef metni.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Kurumsal',
  },
  {
    key: 'design',
    label: 'Mühendislik görsel alanı',
    description: 'Fütüristik çizgiler anlatımı ve bölüm görseli.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Bölüm Başlıkları',
  },
  {
    key: 'expertise',
    label: 'Uzmanlık kartları',
    description: 'Uzmanlık başlıkları, açıklamaları ve sıralaması.',
    href: '/admin/collections/expertise-items',
    location: 'İçerik Yönetimi → Uzmanlıklar',
  },
  {
    key: 'manufacturing',
    label: 'Üretim görsel alanı',
    description: 'Yüksek teknoloji üretim anlatımı ve bölüm görseli.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Bölüm Başlıkları',
  },
  {
    key: 'process',
    label: 'Uçtan uca süreç',
    description: 'Konseptten endüstrileştirmeye süreç anlatımı.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Bölüm Başlıkları',
  },
  {
    key: 'principles',
    label: 'Vizyon, misyon ve değerler',
    description: 'Kurumsal yön, amaç ve değer metinleri.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Kurumsal',
  },
  {
    key: 'solutions',
    label: 'Sektörel çözümler',
    description: 'Savunma ve sivil havacılık çözüm alanları.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → Bölüm Başlıkları',
  },
  {
    key: 'partners',
    label: 'İş ortakları ve referanslar',
    description: 'Kurum logoları, bağlantılar ve görünürlük.',
    href: '/admin/collections/partners',
    location: 'Kurumsal İlişkiler → İş Ortakları',
  },
  {
    key: 'memberships',
    label: 'Kurumsal üyelikler',
    description: 'Üyelik logoları, kurum türleri ve kart görünümü.',
    href: '/admin/collections/memberships',
    location: 'Kurumsal İlişkiler → Üyelikler',
  },
  {
    key: 'contact',
    label: 'İletişim alanı',
    description: 'İletişim metni, e-posta, telefon ve adresler.',
    href: '/admin/globals/site-content',
    location: 'Site İçeriği → İletişim',
  },
]

const sectionByKey = new Map(editableSections.map((section) => [section.key, section]))

export default function VisualSiteEditor() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [language, setLanguage] = useState<PreviewLanguage>('tr')
  const [selectedKey, setSelectedKey] = useState('hero')
  const [ready, setReady] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const preparePreview = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null

    const frame = iframeRef.current
    const document = frame?.contentDocument
    if (!frame || !document) return

    const targets: Array<{ element: Element | null; key: string }> = [
      { element: document.querySelector('#home'), key: 'hero' },
      { element: document.querySelector('#about'), key: 'about' },
      { element: document.querySelectorAll('.narrative-scene')[0] ?? null, key: 'design' },
      { element: document.querySelector('#expertise'), key: 'expertise' },
      { element: document.querySelectorAll('.narrative-scene')[1] ?? null, key: 'manufacturing' },
      { element: document.querySelector('.process-section'), key: 'process' },
      { element: document.querySelector('.principles-section'), key: 'principles' },
      { element: document.querySelector('.magazine-layout'), key: 'solutions' },
      { element: document.querySelector('#references'), key: 'partners' },
      { element: document.querySelector('#memberships'), key: 'memberships' },
      { element: document.querySelector('#contact'), key: 'contact' },
    ]

    const style = document.createElement('style')
    style.dataset.baxVisualEditor = 'true'
    style.textContent = `
      [data-bax-editor-key] { cursor: pointer !important; outline: 0 solid transparent; outline-offset: -4px; position: relative; transition: outline 140ms ease, filter 140ms ease; }
      [data-bax-editor-key]:hover { filter: brightness(.92); outline: 3px dashed #50c7dc; }
      [data-bax-editor-key].bax-editor-selected { outline: 4px solid #50c7dc; outline-offset: -5px; }
      [data-bax-editor-key]::after { background: #153f4d; color: white; content: attr(data-bax-editor-label); font: 700 12px/1.2 Arial,sans-serif; left: 14px; opacity: 0; padding: 9px 12px; pointer-events: none; position: absolute; top: 14px; transform: translateY(-5px); transition: 140ms ease; z-index: 9999; }
      [data-bax-editor-key]:hover::after, [data-bax-editor-key].bax-editor-selected::after { opacity: 1; transform: translateY(0); }
    `
    document.head.appendChild(style)

    for (const { element, key } of targets) {
      const section = sectionByKey.get(key)
      if (!element || !section) continue
      element.setAttribute('data-bax-editor-key', key)
      element.setAttribute('data-bax-editor-label', `Düzenle: ${section.label}`)
      element.classList.toggle('bax-editor-selected', key === selectedKey)
    }

    const handleClick = (event: Event) => {
      const eventTarget = event.target as HTMLElement | null
      const target = eventTarget?.closest<HTMLElement>('[data-bax-editor-key]') ?? null
      if (!target) return

      event.preventDefault()
      event.stopPropagation()
      const key = target.dataset.baxEditorKey
      if (!key) return

      document.querySelectorAll('.bax-editor-selected').forEach((element) => {
        element.classList.remove('bax-editor-selected')
      })
      target.classList.add('bax-editor-selected')
      setSelectedKey(key)
    }

    document.addEventListener('click', handleClick, true)

    const languageButton = Array.from(document.querySelectorAll<HTMLButtonElement>('.lang-selector button'))
      .find((button) => button.textContent?.trim().toLowerCase() === language)
    if (languageButton?.getAttribute('aria-pressed') !== 'true') languageButton?.click()

    setReady(true)
    cleanupRef.current = () => {
      document.removeEventListener('click', handleClick, true)
      style.remove()
    }
  }, [language, selectedKey])

  useEffect(() => () => cleanupRef.current?.(), [])

  useEffect(() => {
    const document = iframeRef.current?.contentDocument
    if (!document) return
    document.querySelectorAll('.bax-editor-selected').forEach((element) => {
      element.classList.toggle(
        'bax-editor-selected',
        element.getAttribute('data-bax-editor-key') === selectedKey,
      )
    })
  }, [selectedKey])

  useEffect(() => {
    const document = iframeRef.current?.contentDocument
    if (!document || !ready) return
    const languageButton = Array.from(document.querySelectorAll<HTMLButtonElement>('.lang-selector button'))
      .find((button) => button.textContent?.trim().toLowerCase() === language)
    if (languageButton?.getAttribute('aria-pressed') !== 'true') languageButton?.click()
  }, [language, ready])

  const selected = sectionByKey.get(selectedKey) ?? editableSections[0]

  return (
    <section className="bax-visual-editor" aria-labelledby="visual-editor-title">
      <header className="bax-visual-editor__header">
        <div>
          <span className="bax-section-code">GÖRSEL İÇERİK EDİTÖRÜ</span>
          <h2 id="visual-editor-title">Sitede gördüğünüz alanı seçin</h2>
          <p>Önizlemede bir bölüme tıklayın; doğru içerik ekranına doğrudan gidin.</p>
        </div>
        <div className="bax-preview-controls">
          <div className="bax-control-group" aria-label="Önizleme dili">
            <button
              className={language === 'tr' ? 'is-active' : ''}
              type="button"
              onClick={() => setLanguage('tr')}
            >
              TR
            </button>
            <button
              className={language === 'en' ? 'is-active' : ''}
              type="button"
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
          <div className="bax-control-group" aria-label="Önizleme cihazı">
            <button
              className={mode === 'desktop' ? 'is-active' : ''}
              type="button"
              onClick={() => setMode('desktop')}
            >
              Masaüstü
            </button>
            <button
              className={mode === 'mobile' ? 'is-active' : ''}
              type="button"
              onClick={() => setMode('mobile')}
            >
              Mobil
            </button>
          </div>
          <button
            className="bax-refresh-preview"
            type="button"
            onClick={() => {
              setReady(false)
              setReloadKey((current) => current + 1)
            }}
          >
            Yenile
          </button>
        </div>
      </header>

      <div className={`bax-preview-stage bax-preview-stage--${mode}`}>
        {!ready && <div className="bax-preview-loading">Site önizlemesi hazırlanıyor…</div>}
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src="/"
          title="BaX web sitesi içerik önizlemesi"
          onLoad={preparePreview}
        />
      </div>

      <footer className="bax-selection-bar" aria-live="polite">
        <div className="bax-selection-bar__number">
          {String(editableSections.findIndex((item) => item.key === selected.key) + 1).padStart(2, '0')}
        </div>
        <div className="bax-selection-bar__content">
          <span>SEÇİLEN ALAN</span>
          <strong>{selected.label}</strong>
          <p>{selected.description}</p>
        </div>
        <div className="bax-selection-bar__location">
          <span>YÖNETİM PANELİNDEKİ YERİ</span>
          <strong>{selected.location}</strong>
        </div>
        <a className="bax-button bax-button--primary" href={selected.href}>
          Bu alanı düzenle →
        </a>
      </footer>
    </section>
  )
}
