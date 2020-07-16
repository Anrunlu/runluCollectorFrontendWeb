<template>
  <q-page class="q-pa-sm q-pt-md">
    <q-table
      title="我的文件"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="title"
      :filter="filter"
      :pagination="pagination"
      rows-per-page-label="单页条目数"
      no-data-label="暂无任务"
    >
      <template v-slot:top-left>
        <q-chip
          square
          color="primary"
          size="lg"
          text-color="white"
          icon="insert_drive_file"
        >
          我的文件
        </q-chip>
      </template>

      <template v-slot:top-right="props">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "退出全屏" : "全屏"
          }}</q-tooltip>
        </q-btn>

        <q-btn flat round dense icon="refresh" v-if="mode === 'list'">
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
            刷新
          </q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <a :href="props.row.fileUrl">
              <q-btn flat round dense color="secondary" icon="get_app" />
            </a>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data="">
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6">
            暂无数据
          </span>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { getMyPosts } from 'src/api/post'
import { formatPostsDetail } from 'src/utils/format-post-data'
export default {
  data () {
    return {
      filter: '',
      loading: true,
      mode: 'list',
      columns: [
        {
          name: 'origname',
          align: 'center',
          label: '文件名',
          field: 'origname',
          sortable: true
        },
        {
          name: 'desclt',
          align: 'center',
          label: '所属收集',
          field: row => row.desclt.title,
          sortable: true
        },
        {
          name: 'updatedAt',
          align: 'center',
          label: '提交时间',
          field: 'updatedAt',
          sortable: true
        },
        {
          name: 'action',
          align: 'center',
          label: '操作',
          field: 'action',
          sortable: true
        }
      ],
      data: [],
      pagination: {
        sortBy: 'updatedAt',
        descending: true,
        rowsPerPage: 10
      }
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
      const { data } = await getMyPosts()
      this.data = formatPostsDetail(data)
      console.log(this.data)

      this.$q.loading.hide()
    }
  }
}
</script>
<style scoped>
a {
  text-decoration: none;
}
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
