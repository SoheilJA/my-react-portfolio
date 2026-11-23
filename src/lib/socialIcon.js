export function socialIcon(name = '') {
  if (/github/i.test(name)) return 'i-github'
  if (/linkedin/i.test(name)) return 'i-linkedin'
  if (/telegram/i.test(name)) return 'i-telegram'
  if (/whatsapp/i.test(name)) return 'i-whatsapp'
  return 'i-globe'
}