<template>
  <q-page padding>
    <div class="row q-gutter-md justify-center">
      <q-card class="my-card col-md-8 col-11">
        <q-card-section>
          <div class="text-h5">{{ cltDetail.title }}</div>
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
            创建时间：{{ cltDetail.create_time }}
          </q-chip>
          <q-chip class="q-mt-md" size="sm" clickable>
            <q-avatar color="green" text-color="white">50</q-avatar>
            已提交人数
          </q-chip>
        </q-card-section>

        <q-separator inset />

        <q-card-section v-html="cltDetail.description"> </q-card-section>

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
        </q-card-section>
      </q-card>
      <q-card class="my-card col-md-3 col-11">
        <q-card-section>文件上传区域</q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { getCollectionInfo } from 'src/api/collection'
import { formatSingleCltDetail } from 'src/utils/format-clt-data'

export default {
  props: ['id'],
  data () {
    return {
      cltDetail: {}
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
      console.log(this.cltDetail)
      this.$q.loading.hide()
    }
  }
}
</script>
