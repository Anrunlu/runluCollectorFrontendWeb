import { http } from '../../boot/axios'

const request = http

export function register (userRegisterDto) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: userRegisterDto
  })
}

export function login (userLoginDto) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: userLoginDto
  })
}

export function getInfo () {
  return request({
    url: '/auth/user',
    method: 'get'
  })
}
