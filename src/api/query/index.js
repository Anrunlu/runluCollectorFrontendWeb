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

export function isSubmitted (cltId) {
  return request({
    url: '/query/isSubmitted',
    method: 'get',
    params: { cltId: cltId }
  })
}

export function getCltSubInfo (cltId, groupId, type) {
  return request({
    url: `/query/subInfo/${cltId}`,
    method: 'get',
    params: { groupId, type }
  })
}
