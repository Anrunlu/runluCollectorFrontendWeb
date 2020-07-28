<template>
  <q-page class="q-pa-sm">
    <q-tabs
      v-model="tab"
      inline-label
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab icon="campaign" name="public" label="公告通知"></q-tab>
      <q-tab icon="notifications_none" name="private" label="我的消息"> </q-tab>
    </q-tabs>
    <q-separator />

    <q-tab-panels v-model="tab" class="bg-grey-1">
      <q-tab-panel name="public">
        <q-list padding separator class="rounded-borders">
          <q-item-label header>公告通知</q-item-label>
          <q-item
            clickable
            v-ripple
            v-for="(notice, index) in notices"
            :key="index"
            @click.stop="$router.push(`/notice/${notice.id}`)"
          >
            <q-item-section avatar top>
              <q-avatar
                :icon="
                  notice.type === 'announcement'
                    ? 'assignment'
                    : notice.type === 'ad'
                    ? 'forum'
                    : notice.type === 'notice'
                    ? 'notifications_none'
                    : 'dehaze'
                "
                :color="
                  notice.type === 'announcement'
                    ? 'primary'
                    : notice.type === 'ad'
                    ? 'pink'
                    : notice.type === 'notice'
                    ? 'green'
                    : 'teal'
                "
                text-color="white"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{notice.title}}</q-item-label>
              <q-item-label caption>{{notice.create_time}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge color="primary" outline :label="'接收者：'+notice.receiver" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="private"> </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script>
import { formatNoticesBaseInfo } from 'src/utils/format-notice'
import { getNoticeList } from 'src/api/notice'
export default {
  data () {
    return {
      tab: 'public',
      notices: []
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
      const { data } = await getNoticeList()
      this.notices = formatNoticesBaseInfo(data)
      this.$q.loading.hide()
    }
  }
}
</script>
