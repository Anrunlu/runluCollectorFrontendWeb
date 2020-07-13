<template>
  <q-page padding>
    <div class="row q-gutter-md justify-center items-start">
      <div class="col-md-8 col-11">
        <q-card class="my-card content-card">
          <q-card-section>
            <q-chip square size="md">
              <q-avatar
                :icon="
                  cltDetail.property === '提交任务' ? 'flag' : 'how_to_vote'
                "
                color="primary"
                text-color="white"
              />
              {{ cltDetail.title }}
            </q-chip>
            <q-space />
            <q-chip class="q-mt-md" size="sm" outline color="purple">
              <q-avatar icon="person" color="purple" text-color="white" />
              {{ cltDetail.creator }}
            </q-chip>
            <q-chip
              class="q-mt-md"
              outline
              color="purple"
              text-color="white"
              icon="event"
              size="sm"
            >
              发布时间：{{ cltDetail.create_time }}
            </q-chip>
            <q-chip
              class="q-mt-md mobile-only"
              size="sm"
              clickable
              @click="showSubTable = !showSubTable"
            >
              <q-avatar color="green" text-color="white">{{
                cltDetail.posts.length
              }}</q-avatar>
              已提交人数
            </q-chip>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="content" v-html="cltDetail.description">
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-chip
              square
              outline
              color="primary"
              text-color="white"
              icon="alarm"
              size="sm"
            >
              截止时间：{{ cltDetail.end_time }}
            </q-chip>
            <q-chip
              square
              size="sm"
              clickable
              @click="
                mySubStatus
                  ? (showSubInfo = !showSubInfo)
                  : (showSubInfo = false)
              "
            >
              <q-avatar
                :color="mySubStatus ? 'positive' : 'negative'"
                text-color="white"
                :icon="mySubStatus ? 'done' : 'report'"
              />
              {{
                mySubStatus
                  ? `您最后提交于：${mySubmittedPost.updatedAt}`
                  : "您尚未上传文件"
              }}
            </q-chip>
          </q-card-section>
        </q-card>

        <PostUploader
          class="my-card upload-card q-mt-md"
          :cltId="cltDetail.id"
          :fileformats="cltDetail.fileformat"
          @fetchReq="fetch"
        />
      </div>

      <q-card class="my-card col-md-3 desktop-only">
        <SubInfoTable :posts="cltDetail.posts" />
      </q-card>

      <q-dialog v-model="showSubTable">
        <q-card class="my-card" style="width: 300px">
          <SubInfoTable :posts="cltDetail.posts" />
        </q-card>
      </q-dialog>

      <q-dialog v-model="showSubInfo">
        <q-card class="my-card" style="width: 300px">
          <q-card-section>
            提交详情
          </q-card-section>
          <q-list bordered separator>
            <q-item v-ripple>
              <q-item-section>
                <q-item-label caption>文件名</q-item-label>
                <q-item-label>{{ mySubmittedPost.origname }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-ripple>
              <q-item-section>
                <q-item-label caption>文件类型</q-item-label>
                <q-item-label>{{ mySubmittedPost.filetype }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-ripple>
              <q-item-section>
                <q-item-label caption>最后提交时间</q-item-label>
                <q-item-label>{{ mySubmittedPost.updatedAt }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions vertical align="center">
            <a href="https://anrunlu.net"
              ><q-btn flat color="primary" icon="get_app" label="下载文件"
            /></a>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import { isSubmitted } from 'src/api/query'
import { getCollectionInfo } from 'src/api/collection'
import { formatSingleCltDetail } from 'src/utils/format-clt-data'
import { formatSinglePostDetail } from 'src/utils/format-post-data'
import PostUploader from 'components/PostUploader'
import SubInfoTable from 'components/SubInfoTable'

export default {
  props: ['id'],
  components: {
    PostUploader,
    SubInfoTable
  },
  data () {
    return {
      showSubTable: false,
      showSubInfo: false,
      cltDetail: {
        posts: []
      },
      mySubStatus: false,
      mySubmittedPost: {}
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data } = await getCollectionInfo(this.id, { mode: 'detail' })
      this.cltDetail = formatSingleCltDetail(data)
      const { data: mySubInfo } = await isSubmitted(this.id)
      this.mySubStatus = mySubInfo.submitted
      if (this.mySubStatus) {
        this.mySubmittedPost = formatSinglePostDetail(mySubInfo.post)
      }

      console.log(this.cltDetail)
      console.log(this.mySubmittedPost)
      this.$q.loading.hide()
    }
  }
}
</script>
<style scoped>
/* .content-card{
  border:1px solid rgb(39, 172, 39)
} */
a {
  text-decoration: none;
}
.content {
  min-height: 10rem;
  max-height: 25rem;
  overflow: auto;
}
</style>
