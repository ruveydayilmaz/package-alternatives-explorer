export const formatNumber = (n: number) =>
  new Intl.NumberFormat().format(Math.round(n))

export const formatDate = (str?: string) => {
  if (!str) return '—'
  const date = new Date(str)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}
