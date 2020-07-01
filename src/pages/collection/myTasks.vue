<template>
  <q-page class="q-pa-sm q-pt-md">
    <q-table
      title="任务列表"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="name"
      :grid="mode == 'grid'"
      :filter="filter"
      :pagination.sync="pagination"
      :loading="loading"
      rows-per-page-label="单页条目数"
      no-data-label="暂无任务"
      @row-click="rowClick"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:top-left>
        <q-chip square color="green" size="lg" text-color="white" icon="topic">
          任务列表
        </q-chip>
      </template>

      <template v-slot:top-right="props">
        <!-- <q-btn @click="new_customer=true" outline color="primary" label="Add New" class="q-mr-xs" /> -->

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

        <q-btn
          flat
          round
          dense
          icon="refresh"
          @click="fetch"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
            刷新
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
            mode === 'grid'
              ? visibleColumns.pop()
              : visibleColumns.push('groups');
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid" ? "列表显示" : "网格显示"
          }}</q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="
              props.row.status == '进行中'
                ? 'green'
                : props.row.status == '将截止'
                ? 'red'
                : 'grey'
            "
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            style="width: 85px"
            >{{ props.row.status }}</q-chip
          >
        </q-td>
      </template>

      <template v-slot:body-cell-groups="props">
        <q-td :props="props">
          <q-chip
            v-for="(group, index) in props.row.groups"
            :key="index"
            outline
            color="blue"
            text-color="white"
            dense
            square
            >{{ group.name }}</q-chip
          >
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
import { getMyTasks } from 'src/api/query'
import { date } from 'quasar'
export default {
  data () {
    return {
      filter: '',
      loading: true,
      customer: {},
      new_customer: false,
      mode: 'list',
      visibleColumns: [
        'title',
        'creator',
        'status',
        'end_date',
        'property',
        'groups'
      ],
      columns: [
        {
          name: 'title',
          align: 'left',
          label: '标题',
          field: 'title',
          sortable: true
        },
        {
          name: 'creator',
          required: true,
          label: '创建者',
          align: 'left',
          field: row => row.creator,
          sortable: true
        },
        {
          name: 'groups',
          align: 'left',
          label: '所属群组',
          field: 'groups',
          sortable: true
        },
        {
          name: 'status',
          align: 'left',
          label: '状态',
          field: 'status',
          sortable: true
        },
        {
          name: 'end_date',
          align: 'left',
          label: '截止时间',
          field: 'end_time',
          sortable: true
        }
      ],
      data: [],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      this.loading = true
      const { data } = await getMyTasks()
      this.formatCltData(data)
      this.loading = false
    },
    formatCltData (cltsData) {
      // eslint-disable-next-line prefer-const
      let newData = []
      cltsData.reduce((pre, curr, index) => {
        // eslint-disable-next-line prefer-const
        let cltInfo = {}
        cltInfo.id = curr.id
        cltInfo.title = curr.title
        cltInfo.creator = curr.creator.nickname
        cltInfo.groups = curr.groups

        const diff = date.getDateDiff(curr.endtime, Date.now(), 'hours')
        if (diff > 1) {
          cltInfo.status = '进行中'
        } else if (diff > 0) {
          cltInfo.status = '将截止'
        } else {
          cltInfo.status = '已截止'
        }

        cltInfo.end_time = date.formatDate(curr.endtime, 'MM/DD HH:mm')
        pre.push(cltInfo)
        return pre
      }, newData)
      this.data = newData
    },
    rowClick (evt, row) {
      console.log(row)
      this.$router.push(`/collections/edit/${row.id}`)
    }
  }
}
</script>
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
