<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-py-md q-px-xs row justify-center bg-image">
        <q-card class="col-md-10 col-12" style="height:100%">
          <q-card-section>
            <div class="row">
              <q-chip
                class="glossy"
                outline
                square
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
                :color="
                  notice.type === 'announcement'
                    ? 'primary'
                    : notice.type === 'ad'
                    ? 'pink'
                    : notice.type === 'notice'
                    ? 'green'
                    : 'teal'
                "
                :icon="
                  notice.type === 'announcement'
                    ? 'assignment'
                    : notice.type === 'ad'
                    ? 'forum'
                    : notice.type === 'notice'
                    ? 'notifications_none'
                    : 'dehaze'
                "
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
                color="deep-purple"
                icon="rss_feed"
                :label="notice.receiver"
              />
              <q-chip
                dense
                square
                outline
                color="indigo"
                icon="today"
                :label="notice.create_time"
              />
            </div>
          </q-card-section>
          <q-separator spaced inset />
          <q-card-section>
            <div class="q-px-xs content" v-html="notice.content"></div>
          </q-card-section>
          <!-- <q-separator spaced inset /> -->
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
      this.notice = formatNoticeBaseInfo(data)
      this.$q.loading.hide()
    }
  }
}
</script>
<style>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
}
a {
  text-decoration: none;
}
.content {
  width: 100%;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
}
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
