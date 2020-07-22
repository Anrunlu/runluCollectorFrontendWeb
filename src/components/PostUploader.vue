<template>
  <q-card>
    <q-card-section class="row items-end">
      <q-chip square size="md">
        <q-avatar icon="cloud_upload" color="primary" text-color="white" />
        文件上传区域
      </q-chip>
      <q-chip
        v-for="(format, index) in fileformats"
        :key="index"
        square
        size="xs"
        color="secondary"
        text-color="white"
        :label="format"
      />
    </q-card-section>
    <q-card-section
      ><q-file
        v-model="file"
        label="选择或拖拽文件于此"
        outlined
        rounded
        use-chips
        counter
        max-file-size="20971520"
        @rejected="onRejected"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template> </q-file
    ></q-card-section>
    <q-card-section>
      <q-btn
        class="full-width"
        color="green"
        outline
        :loading="btnLoading"
        icon="cloud_upload"
        label="提交文件"
        @click="onClickSubmitFile"
      >
        <template v-slot:loading>
          <q-linear-progress
            stripe
            size="35px"
            :value="progress"
            track-color="white"
            color="green"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="accent"
                text-color="white"
                :label="progressLabel"
              />
            </div>
          </q-linear-progress>
        </template>
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script>
import { isSubmitted } from 'src/api/query'
import { qiniuFileUpLoad, deleteSgFile } from 'src/utils/qiniu'
import { createPost, updatePost } from 'src/api/post'
export default {
  name: 'PostUploader',
  props: ['cltId', 'fileformats'],
  data () {
    return {
      btnLoading: false,
      progress: 0,
      file: null
    }
  },
  computed: {
    progressLabel () {
      return (this.progress * 100).toFixed(2) + '%'
    }
  },
  methods: {
    async upload () {
      // 调用七牛上传
      const uploadRes = await qiniuFileUpLoad(
        this.cltId,
        this.$store.getters['user/username'],
        this.file,
        this
      )
      // 同步数据到数据库
      const post = {
        org: this.$store.getters['user/orgId'],
        creator: this.$store.getters['user/id'],
        desclt: this.cltId,
        origname: this.file.name,
        filetype: this.file.name.replace(/.+\./, ''),
        fileUrl: `http://cltdownload.anrunlu.net/${uploadRes.key}`
      }

      try {
        // 创建数据库记录
        await createPost(post)
        // 告知父组件进行刷新
        this.$emit('fetchReq')
        this.$q.notify({
          message: '提交成功',
          color: 'positive',
          icon: 'done',
          position: 'center',
          timeout: 2000
        })
        this.progress = 0
        this.btnLoading = false
      } catch (e) {
        console.log(e)
        this.$q.notify({
          message: '提交失败，请稍后再试',
          color: 'negative',
          icon: 'done',
          position: 'center',
          timeout: 2000
        })
        this.progress = 0
        this.btnLoading = false
      }
    },
    async reUpload (post) {
      // 从七牛存储删除之前的文件
      const filekey = post.fileUrl.split('/').pop()
      await deleteSgFile(filekey)
      // 调用七牛上传
      const uploadRes = await qiniuFileUpLoad(
        this.cltId,
        this.$store.getters['user/username'],
        this.file,
        this
      )

      // 同步数据到数据库
      const upPost = {
        origname: this.file.name,
        filetype: this.file.name.replace(/.+\./, ''),
        fileUrl: `http://cltdownload.anrunlu.net/${uploadRes.key}`
      }

      try {
        // 更新数据库记录
        await updatePost(post._id, upPost)
        // 告知父组件进行刷新
        this.$emit('fetchReq')
        this.$q.notify({
          message: '提交成功',
          color: 'positive',
          icon: 'done',
          position: 'center',
          timeout: 2000
        })
        this.progress = 0
        this.file = null
        this.btnLoading = false
      } catch (e) {
        console.log(e)
        this.$q.notify({
          message: '提交失败，请稍后再试',
          color: 'negative',
          icon: 'done',
          position: 'center',
          timeout: 2000
        })
        this.progress = 0
        this.file = null
        this.btnLoading = false
      }
    },

    async onClickSubmitFile () {
      this.btnLoading = true
      // 判断是否选择了文件
      if (!this.file) {
        this.$q.notify({
          message: '请先选择文件',
          icon: 'announcement',
          color: 'info',
          position: 'center',
          timeout: 1000
        })
        this.btnLoading = false
        return
      }

      // 1、查询是否已上传
      const { data } = await isSubmitted(this.cltId)
      if (data.submitted) {
        const post = data.post

        this.$q
          .dialog({
            title: '请确认',
            message:
              '你已经提交过文件，请确人是否要覆盖之前的文件，此操作不可恢复',
            ok: {
              label: '覆盖',
              push: true
            },
            cancel: {
              label: '取消',
              push: true,
              color: 'negative'
            },
            persistent: true
          })
          .onOk(async () => {
            // 调用 reUpload
            this.reUpload(post)
          })
          .onCancel(() => {
            this.$q.notify({
              message: '操作取消',
              color: 'warning',
              position: 'center',
              timeout: 1000
            })
            this.btnLoading = false
          })
      } else {
        // 调用 upload
        this.upload()
      }
    },
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: '单文件大小不得超过20MB'
      })
    }
  }
}
</script>
