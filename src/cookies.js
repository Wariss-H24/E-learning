// Durée par défaut : 7 jours
const DEFAULT_DAYS = 7

export function setCookie(name, value, days = DEFAULT_DAYS) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`
}

export function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1]
    .split(';')[0]
    ? decodeURIComponent(
        document.cookie
          .split('; ')
          .find(row => row.startsWith(name + '='))
          .split('=')[1]
      )
    : null
}

export function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
}
