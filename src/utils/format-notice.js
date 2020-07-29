import { date } from 'quasar'

export function formatNoticeBaseInfo (notice) {
  // eslint-disable-next-line prefer-const
  let newNotice = {}
  newNotice.id = notice._id
  newNotice.title = notice.title
  newNotice.type = notice.type
  if (notice.content) {
    newNotice.content = notice.content
  }
  newNotice.type = notice.type
  switch (notice.receivertype) {
    case 'Org':
      newNotice.receiver = notice.receiver.name
      break
    case 'Group':
      newNotice.receiver = notice.receiver.name
      break
    case 'User':
      newNotice.receiver = notice.receiver.nickname
      break
  }
  newNotice.create_time = date.formatDate(notice.createdAt, 'MM/DD HH:mm')
  return newNotice
}

export function formatNoticesBaseInfo (noticesData) {
  const newData = []
  noticesData.reduce((pre, curr) => {
    // eslint-disable-next-line prefer-const
    pre.push(formatNoticeBaseInfo(curr))
    return pre
  }, newData)
  return newData
}
