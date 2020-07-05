import { http as request } from '../../boot/axios'

export function getMyPosts () {
  return request({
    url: '/posts',
    method: 'get'
  })
}

export function getPostInfo (id) {
  return request({
    url: `/posts/${id}`,
    method: 'get'
  })
}

export function createPost (postCreateDto) {
  return request({
    url: '/posts',
    method: 'post',
    data: postCreateDto
  })
}

export function updatePost (id, postUpdateDto) {
  return request({
    url: `/posts/${id}`,
    method: 'put',
    data: postUpdateDto
  })
}

export function deletePost (id) {
  return request({
    url: `/posts/${id}`,
    method: 'delete'
  })
}
