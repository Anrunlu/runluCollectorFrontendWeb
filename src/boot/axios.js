import axios from 'axios'
import { getToken } from 'src/utils/auth'
import { Notify } from 'quasar'

export const http = axios.create({
  baseURL: process.env.API,
  timeout: 50000
})

export default ({ app, router, store }) => {
  // response interceptor
  http.interceptors.response.use(
    res => {
      return res
    },
    err => {
      if (err.response.data.message) {
        if (err.response.status === 401) {
          Notify.create({
            message: '请先登录',
            color: 'red',
            icon: 'error',
            position: 'center'
          })
          router.push('/login')
        } else if (err.response.status === 500) {
          Notify.create({
            message: '服务器异常，请稍后再试',
            color: 'red',
            icon: 'error',
            position: 'center'
          })
        } else {
          Notify.create({
            message: err.response.data.message,
            type: 'negative',
            position: 'center'
          })
          switch (err.response.data.statusCode) {
            // 收集不存在或已被撤销
            case 1404:
              router.push('/collections/myTasks')
              break
            // 非收集创建者，无法访问
            case 1401:
              router.push('/me/collections')
              break
            // 非征集对象，无法访问
            case 1400:
              router.push('/collections/myTasks')
              break
            // 群组不存在或已被解散
            case 3404:
              router.push('/me/groups')
              break
            // 非群组成员或创建者，无法访问
            case 3400:
              router.push('/me/groups')
              break
          }
        }
      }
      return Promise.reject(err)
    }
  )

  // request interceptor
  http.interceptors.request.use(
    config => {
      // do something before request is sent

      if (store.getters['user/token']) {
        // let each request carry token
        config.headers.Authorization = 'Bearer ' + getToken() || ''
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )
}
