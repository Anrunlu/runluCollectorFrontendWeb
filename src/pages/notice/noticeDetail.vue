<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md row justify-center bg-image">
        <q-card class="col-md-10 col-12">
          <q-card-section>
            <div class="row">
              <q-chip
                class="glossy"
                outline
                size="lg"
                :icon="
                  notice.type === 'announcement'
                    ? 'assignment'
                    : notice.type === 'ad'
                    ? 'forum'
                    : notice.type === 'notice'
                    ? 'notifications_none'
                    : 'dehaze'
                "
                :label="notice.title"
              />
            </div>
            <div class="row">
              <q-chip
                dense
                square
                outline
                color="pink"
                :label="
                  notice.type === 'announcement'
                    ? '公告'
                    : notice.type === 'ad'
                    ? '广告'
                    : notice.type === 'notice'
                    ? '通知'
                    : '其他'
                "
              />
              <q-chip
                dense
                square
                outline
                color="primary"
                icon="rss_feed"
                :label="notice.receiver"
              />
              <q-chip
                dense
                square
                outline
                icon="today"
                :label="notice.create_time"
              />
            </div>
          </q-card-section>
          <q-separator spaced inset />
          <q-card-section>
            <div class="q-px-md" v-html="notice.content"></div>
          </q-card-section>
          <q-separator spaced inset />
          <div class="text-center text-grey q-pa-sm">
            <span>润鲁收集系统</span>
          </div>
        </q-card>
        <q-page-sticky
          class="desktop-only"
          position="top-left"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="arrow_back"
            color="green"
            @click="$router.replace('/notice')"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { formatNoticeBaseInfo } from 'src/utils/format-notice'
import { getNoticeDetail } from 'src/api/notice'
export default {
  props: ['id'],
  data () {
    return {
      notice: []
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
      const { data } = await getNoticeDetail(this.id)
      console.log(data)
      this.notice = formatNoticeBaseInfo(data)
      this.$q.loading.hide()
    }
  }
}
</script>
<style scoped>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
