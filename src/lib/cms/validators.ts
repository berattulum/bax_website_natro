export function validateHttpsUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'Web sitesi adresi zorunludur.'
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || 'Adres https:// ile başlamalıdır.'
  } catch {
    return 'Geçerli bir web sitesi adresi girin.'
  }
}

export function validateInternalPathOrHttpsUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim().length === 0) return 'Bağlantı zorunludur.'
  if (value.startsWith('/') && !value.startsWith('//')) return true
  return validateHttpsUrl(value)
}

export function validateUniqueSections(value: unknown) {
  if (!Array.isArray(value)) return true

  const sections = value
    .map((item) => item && typeof item === 'object' && 'section' in item ? item.section : null)
    .filter((section): section is string => typeof section === 'string')

  return new Set(sections).size === sections.length || 'Aynı bölüm sayfa düzenine yalnızca bir kez eklenebilir.'
}
