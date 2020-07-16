import { http as request } from '../../boot/axios'

export function getGroupList (params) {
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function getGroupDetail (id) {
  return request({
    url: `/groups/${id}`,
    method: 'get'
  })
}
