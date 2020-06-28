import axios from 'axios'
import { getToken } from 'src/utils/auth'
import { Notify } from 'quasar'

export const http = axios.create({
  baseURL: process.env.API,
  timeout: 50000
})

export default async ({ app, router, store }) => {
  // response interceptor
  http.interceptors.response.use(
    res => {
      return res
    },
    err => {
      if (err.response.data.message) {
        Notify.create({
          message: err.response.data.message,
          color: 'red',
          icon: 'error',
          position: 'center'
        })
        if (err.response.status === 401) {
          router.push('/login')
        }
      }
      return Promise.reject(err)
    }
  )

  // request interceptor
  http.interceptors.request.use(
    config => {
    // do something before request is sent
      console.log('axios', store.getters['user/token'])

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
