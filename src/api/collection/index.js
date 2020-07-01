import { http as request } from '../../boot/axios'

export function getMyCollections () {
  return request({
    url: '/collections',
    method: 'get'
  })
}

export function getCollectionInfo (id) {
  return request({
    url: `/collections/${id}`,
    method: 'get'
  })
}

export function createCollection (collectionCreateDto) {
  return request({
    url: '/collections',
    method: 'post',
    data: collectionCreateDto
  })
}

export function updateCollection (id, collectionUpdateDto) {
  return request({
    url: `/collections/${id}`,
    method: 'put',
    data: collectionUpdateDto
  })
}
