import { http as request } from '../../boot/axios'

export function getOrgList () {
  return request({
    url: '/query/orgs',
    method: 'get'
  })
}

export function getOrgDetail (id) {
  return request({
    url: `/query/org/${id}`,
    method: 'get'
  })
}

export function getMyTasks () {
  return request({
    url: '/query/tasklist',
    method: 'get'
  })
}

export function getMyAccessableGroups () {
  return request({
    url: '/query/myAccessableGroups',
    method: 'get'
  })
}
