import { http as request } from '../../boot/axios'

export function createCollection (collectionCreateDto) {
  return request({
    url: '/collections',
    method: 'post',
    data: collectionCreateDto
  })
}
