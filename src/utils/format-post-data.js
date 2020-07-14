import { date } from 'quasar'

export function formatSinglePostDetail (post) {
  post.createdAt = date.formatDate(post.createdAt, 'MM/DD HH:mm')
  post.updatedAt = date.formatDate(post.updatedAt, 'MM/DD HH:mm')
  return post
}

export function formatPostsDetail (posts) {
  posts.forEach(post => {
    formatSinglePostDetail(post)
  })
  return posts
}
