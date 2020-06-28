import { getToken } from '../../utils/auth'

function getDefaultState () {
  return {
    token: getToken(),
    username: '',
    nickname: '',
    userlevel: -1,
    id: '',
    orgId: ''
  }
}

export function RESET_TOKEN (state) {
  Object.assign(state, getDefaultState())
}

export function SET_TOKEN (state, token) {
  state.token = token
}

export function SET_ID (state, id) {
  state.id = id
}

export function SET_ORGID (state, orgId) {
  state.orgId = orgId
}

export function SET_USERNAME (state, username) {
  state.username = username
}

export function SET_NICKNAME (state, nickname) {
  state.nickname = nickname
}

export function SET_USERLEVEL (state, userlevel) {
  state.userlevel = userlevel
}
