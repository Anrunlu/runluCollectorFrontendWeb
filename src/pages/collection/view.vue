<template>
  <q-page padding>
    <div class="row q-gutter-md justify-center items-start">
      <div class="col-md-8 col-11">
        <q-card class="my-card content-card">
          <q-card-section>
            <q-chip square size="md">
              <q-avatar :icon="cltDetail.property==='提交任务'?'flag':'how_to_vote'" color="primary" text-color="white" />
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
            <q-chip class="q-mt-md" size="sm" clickable>
              <q-avatar color="green" text-color="white">50</q-avatar>
              已提交人数
            </q-chip>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="content" v-html="cltDetail.description"> </q-card-section>

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
              :color="mySubStatus ? 'positive' : 'negative'"
              text-color="white"
              :icon="mySubStatus ? 'done' : 'report'"
              size="sm"
            >
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
        <q-table
          title="已提交名单"
          :data="cltDetail.posts"
          :columns="columns"
          row-key="name"
          :pagination.sync="pagination"
        />
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { isSubmitted } from 'src/api/query'
import { getCollectionInfo } from 'src/api/collection'
import { formatSingleCltDetail } from 'src/utils/format-clt-data'
import { formatSinglePostDetail } from 'src/utils/format-post-data'
import PostUploader from 'components/PostUploader'

export default {
  props: ['id'],
  components: {
    PostUploader
  },
  data () {
    return {
      columns: [
        {
          name: 'submitter',
          required: true,
          label: '姓名',
          align: 'left',
          field: row => row.submitter,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'subtime',
          align: 'center',
          label: '时间',
          field: 'subtime',
          sortable: true
        }
      ],
      pagination: {
        sortBy: 'subtime',
        descending: false,
        rowsPerPage: 10
      },
      cltDetail: {},
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
.content{
  min-height: 10rem;
  max-height: 25rem;
  overflow: auto;
}
</style>
