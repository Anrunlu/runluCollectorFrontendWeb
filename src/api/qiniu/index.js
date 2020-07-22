import { http as request } from '../../boot/axios'

export function getUploadToken () {
  return request({
    url: '/qiniu/uploadToken',
    method: 'get'
  })
}

export function deleteSingleFile (filekey) {
  return request({
    url: '/qiniu/deleteSingleFile',
    method: 'delete',
    params: { filekey }
  })
}
