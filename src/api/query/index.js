import { http as request } from '../../boot/axios'

export function getOrgList () {
  return request({
    url: '/query/orgs',
    method: 'get'
  })
}

export function getOrgDetail (id) {
  console.log('in http')
  return request({
    url: `/query/org/${id}`,
    method: 'get'
  })
}
