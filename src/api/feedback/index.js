import { http as request } from '../../boot/axios'

export function createFeedback (feedbackCreateDto) {
  return request({
    url: '/feedbacks',
    method: 'post',
    data: feedbackCreateDto
  })
}
