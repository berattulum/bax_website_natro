'use client'

import { useState } from 'react'
import type { EditorGroup, EditorPageKey } from './editor-config'

type JsonObject = Record<string, unknown>

const labels: Record<string, string> = {
  eyebrow: 'Üst başlık', role: 'Rol / uzmanlık', intro: 'Giriş açıklaması', focusLabel: 'Bölüm etiketi', focusTitle: 'Bölüm başlığı', facts: 'Liderlik ve deneyim maddeleri', sources: 'Kaynaklar başlığı', mach: 'MachFlexComp bağlantı metni', loco: 'LOCO3 bağlantı metni', sampe: 'SAMPE bağlantı metni', linkedin: 'LinkedIn bağlantı metni', title: 'Ana başlık', titleAccent: 'Vurgulu başlık', identity: 'Şirket kayıtları başlığı', offices: 'Operasyon noktaları başlığı', head: 'Genel merkez etiketi', branch: 'Üretim şubesi etiketi', verify: 'Doğrulama başlığı', verifyText: 'Doğrulama açıklaması', verifyLink: 'Doğrulama butonu', legal: 'Yasal belgeler başlığı', heroKicker: 'Açılış etiketi', heroTitle: 'Açılış başlığı', heroText: 'Açılış açıklaması', heroCta: 'Açılış butonu', nav: 'Sayfa içi navigasyon', principles: 'Temel ilkeler', focus: 'Odak alanları', platforms: 'Mühendislik platformları', journey: 'Döngüsellik adımları', evidenceStages: 'Yaşam döngüsü aşamaları', goals: 'Sürdürülebilir kalkınma hedefleri', closingTitle: 'Kapanış başlığı', closingText: 'Kapanış açıklaması', closingCta: 'Kapanış butonu', disclaimer: 'Yasal açıklama',
}

function friendlyLabel(key: string) {
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
}

function setAtPath(value: unknown, path: number[], next: string): unknown {
  if (path.length === 0) return next
  if (!Array.isArray(value)) return value
  const clone = [...value]
  const [index, ...rest] = path
  clone[index] = setAtPath(clone[index], rest, next)
  return clone
}

function ArrayEditor({ label, value, onChange }: { label: string; value: unknown[]; onChange: (value: unknown[]) => void }) {
  return <div className="bx-array-field"><span>{label}</span><div>{value.map((item, index) => Array.isArray(item)
    ? <article key={index}><b>{String(index + 1).padStart(2, '0')}</b>{item.map((entry, childIndex) => <textarea aria-label={`${label} ${index + 1}.${childIndex + 1}`} key={childIndex} onChange={(event) => onChange(setAtPath(value, [index, childIndex], event.target.value) as unknown[])} rows={childIndex === item.length - 1 ? 3 : 1} value={String(entry)} />)}</article>
    : <textarea aria-label={`${label} ${index + 1}`} key={index} onChange={(event) => onChange(setAtPath(value, [index], event.target.value) as unknown[])} rows={2} value={String(item)} />)}</div></div>
}

export default function EditorForm({ pageKey, groups, initialTr, initialEn }: { pageKey: EditorPageKey; groups: readonly EditorGroup[]; initialTr: JsonObject; initialEn: JsonObject }) {
  const [locale, setLocale] = useState<'tr' | 'en'>('tr')
  const [content, setContent] = useState({ tr: initialTr, en: initialEn })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const current = content[locale]

  const change = (key: string, value: unknown) => setContent((state) => ({ ...state, [locale]: { ...state[locale], [key]: value } }))
  const save = async (status: 'draft' | 'published') => {
    setSaving(true); setMessage('')
    const response = await fetch(`/api/admin/pages/${pageKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, content: current, status }) })
    setMessage(response.ok ? (status === 'published' ? 'Değişiklikler yayınlandı.' : 'Taslak kaydedildi.') : 'Kaydetme sırasında bir hata oluştu.')
    setSaving(false)
  }

  return <>
    <div className="bx-editor__bar"><div className="bx-editor__locales"><button className={locale === 'tr' ? 'is-active' : ''} onClick={() => setLocale('tr')} type="button">Türkçe</button><button className={locale === 'en' ? 'is-active' : ''} onClick={() => setLocale('en')} type="button">English</button></div><div className="bx-editor__actions"><span aria-live="polite">{message}</span><button disabled={saving} onClick={() => save('draft')} type="button">Taslak kaydet</button><button className="is-primary" disabled={saving} onClick={() => save('published')} type="button">Yayınla</button></div></div>
    <div className="bx-editor__groups">{groups.map((group, groupIndex) => <section key={group.title}><header><span>{String(groupIndex + 1).padStart(2, '0')}</span><div><h2>{group.title}</h2><p>{group.description}</p></div></header><div className="bx-editor__fields">{group.keys.map((key) => Array.isArray(current[key]) ? <ArrayEditor key={key} label={friendlyLabel(key)} value={current[key] as unknown[]} onChange={(value) => change(key, value)} /> : <label key={key}><span>{friendlyLabel(key)}</span><textarea onChange={(event) => change(key, event.target.value)} rows={String(current[key] || '').length > 100 ? 4 : 2} value={String(current[key] || '')} /></label>)}</div></section>)}</div>
  </>
}
