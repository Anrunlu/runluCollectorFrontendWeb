import { date } from 'quasar'

export function formatCltBaseInfo (cltsData) {
  const newData = []
  cltsData.reduce((pre, curr) => {
    // eslint-disable-next-line prefer-const
    let cltInfo = {}
    cltInfo.id = curr.id
    cltInfo.title = curr.title
    cltInfo.creator = curr.creator
    cltInfo.groups = curr.groups.map((group) => group.name)
    cltInfo.property = curr.property === 'private' ? '提交任务' : '公开征集'

    const diff = date.getDateDiff(curr.endtime, Date.now(), 'minutes')
    if (diff > 60) {
      cltInfo.status = '进行中'
    } else if (diff >= 0) {
      cltInfo.status = '将截止'
    } else {
      cltInfo.status = '已截止'
    }

    cltInfo.create_time = date.formatDate(curr.createdAt, 'MM/DD HH:mm')
    cltInfo.end_time = date.formatDate(curr.endtime, 'MM/DD HH:mm')

    cltInfo.cycleRate = getDiff(curr.createdAt, curr.endtime).cycleRate
    cltInfo.diffToEnd = getDiff(curr.createdAt, curr.endtime).diffToEnd
    pre.push(cltInfo)
    return pre
  }, newData)
  return newData
}

export function formatSingleCltDetail (cltData) {
  const newData = {}
  newData.id = cltData.id
  newData.title = cltData.title
  newData.creator = cltData.creator
  newData.description = cltData.description
  newData.create_time = date.formatDate(cltData.createdAt, 'MM/DD HH:mm')
  newData.end_time = date.formatDate(cltData.endtime, 'MM/DD HH:mm')
  newData.property = cltData.property === 'private' ? '提交任务' : '公开征集'
  newData.fileformat = cltData.fileformat.map((item) => item[0])
  newData.groups = cltData.groups.map((group) => group.name)
  newData.posts = cltData.posts.map((post) => {
    const subtime = date.formatDate(post.updatedAt, 'MM/DD HH:mm')
    return { submitter: post.creator, subtime: subtime }
  })
  return newData
}

export function getDiff (starttime, endtime) {
  const diffCycle = date.getDateDiff(endtime, starttime, 'hours')
  const diffToEnd = date.getDateDiff(endtime, Date.now(), 'hours')
  const cycleRate = (diffToEnd / diffCycle).toFixed(2)
  return { cycleRate, diffToEnd }
}
