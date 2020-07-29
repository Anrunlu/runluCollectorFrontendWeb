import { Cookies } from 'quasar'

const TokenKey = 'runluCollecting_token'

export function getToken () {
  return Cookies.get(TokenKey) || ''
}

export function setToken (token) {
  Cookies.set(TokenKey, token, { sameSite: 'Strict' })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
