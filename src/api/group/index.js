import { http as request } from '../../boot/axios'

export function getGroupList (params) {
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function getGroupDetail (id) {
  return request({
    url: `/groups/${id}`,
    method: 'get'
  })
}

export function getDingTalkSettings (id) {
  return request({
    url: `/groups/ddsetings/${id}`,
    method: 'get'
  })
}

export function setDingTalkSettings (id, dingTalkSettingsDto) {
  return request({
    url: `/groups/ddsetings/${id}`,
    method: 'put',
    data: dingTalkSettingsDto
  })
}

export function createGroup (createGroupDto) {
  return request({
    url: '/groups',
    method: 'post',
    data: createGroupDto
  })
}

export function joinGroup (groupId) {
  return request({
    url: `/groups/join/${groupId}`,
    method: 'get'
  })
}

export function setManager (groupId, userId, type) {
  // type=set 设置管理员 ,否则取消管理员
  return request({
    url: `/groups/setManager/${groupId}`,
    method: 'get',
    params: { userId, type }
  })
}

export function leaveGroup (groupId) {
  return request({
    url: `/groups/leave/${groupId}`,
    method: 'get'
  })
}

export function kickOut (userId, groupId) {
  return request({
    url: '/groups/kickOut',
    method: 'put',
    params: { userId, groupId }
  })
}

export function removeGroup (groupId) {
  return request({
    url: `/groups/remove/${groupId}`,
    method: 'delete'
  })
}
