import { http as request } from '../../boot/axios'

export function getNoticeList () {
  return request({
    url: '/notices',
    method: 'get'
  })
}

export function getNoticeDetail (id) {
  return request({
    url: `/notices/${id}`,
    method: 'get'
  })
}
