'use client'

import { useEffect, useRef, useState } from 'react'

export type HeaderLanguage = 'tr' | 'en'

export function HeaderLanguageMenu({
  value,
  onChange,
  label,
}: {
  value: HeaderLanguage
  onChange: (language: HeaderLanguage) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const select = (language: HeaderLanguage) => {
    onChange(language)
    setOpen(false)
  }

  return <div className={`header-language${open ? ' is-open' : ''}`} ref={root}>
    <button
      type="button"
      className="header-language-trigger"
      aria-label={label}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      <span>{value.toUpperCase()}</span>
      <i aria-hidden="true">⌄</i>
    </button>
    <div className="header-language-options" role="listbox" aria-label={label}>
      {(['en', 'tr'] as const).map((language) => <button
        type="button"
        role="option"
        aria-selected={value === language}
        className={value === language ? 'is-selected' : undefined}
        onClick={() => select(language)}
        key={language}
      >
        <span>{language.toUpperCase()}</span>
        <small>{language === 'en' ? 'English' : 'Türkçe'}</small>
      </button>)}
    </div>
  </div>
}
