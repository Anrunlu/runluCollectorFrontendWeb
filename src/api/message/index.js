import { http as request } from '../../boot/axios'

export function sendNotifyToOne (cltId, userId) {
  return request({
    url: '/messages/sendNotifyToOne',
    method: 'get',
    params: { cltId, userId }
  })
}

export function sendNotifyToGroup (cltId, groupId) {
  return request({
    url: '/messages/sendNotifyToGroup',
    method: 'get',
    params: { cltId, groupId }
  })
}
