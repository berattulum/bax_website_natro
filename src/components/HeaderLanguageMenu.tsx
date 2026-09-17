'use client'

import { useRef } from 'react'
import { localizedPath } from '@/lib/i18n/site-routes'

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
  const root = useRef<HTMLDetailsElement>(null)

  const select = (language: HeaderLanguage) => {
    onChange(language)
    if (root.current) root.current.open = false
    window.location.assign(localizedPath(window.location.pathname, language))
  }

  return <details className="header-language" ref={root}>
    <summary
      className="header-language-trigger"
      aria-label={label}
      aria-haspopup="listbox"
    >
      <span>{value.toUpperCase()}</span>
      <i aria-hidden="true">⌄</i>
    </summary>
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
  </details>
}
