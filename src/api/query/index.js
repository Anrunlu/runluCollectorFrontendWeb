import request from '../../boot/axios'

export function getOrgList () {
  return request({
    url: '/query/orgs',
    method: 'get'
  })
}
