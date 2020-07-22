import { getUploadToken, deleteSingleFile } from 'src/api/qiniu'
import * as qiniu from 'qiniu-js'

export async function qiniuFileUpLoad (cltId, username, file, that) {
  const { data } = await getUploadToken()
  const uploadToken = data.uploadToken
  console.log('获取uptoken成功')
  return new Promise((resolve, reject) => {
    /* 上传文件 */
    // 上传前准备
    const key = `${cltId}-${username}-${Date.now()}.${file.name.replace(
      /.+\./,
      ''
    )}`
    const putExtra = {
      fname: file.name
    }

    // 定义一个观察对象用于显示进度
    const observer = {
      next (res) {
        // 显示上传进度
        that.progress = res.total.percent / 100
      },
      error (err) {
        reject(err)
      },
      complete (res) {
        resolve(res)
      }
    }
    // 调用qiniu api 上传
    const observable = qiniu.upload(file, key, uploadToken, putExtra, {})
    observable.subscribe(observer) // 上传开始
  })
}

export async function deleteSgFile (filekey) {
  await deleteSingleFile(filekey)
}