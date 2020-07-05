import { date } from 'quasar'

export function formatSinglePostDetail (post) {
  post.createdAt = date.formatDate(post.createdAt, 'MM/DD HH:mm')
  post.updatedAt = date.formatDate(post.updatedAt, 'MM/DD HH:mm')
  return post
}
