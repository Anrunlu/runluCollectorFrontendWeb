<template>
  <q-page class="q-pa-sm q-pt-md">
    <q-table
      title="我的收集"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="name"
      :filter="filter"
      :pagination.sync="pagination"
      rows-per-page-label="单页条目数"
      no-data-label="暂无任务"
      @row-click="rowClick"
    >
      <template v-slot:top-left>
        <q-chip
          square
          color="primary"
          size="lg"
          text-color="white"
          icon="folder"
        >
          我的收集
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

      <template v-slot:body-cell-property="props">
        <q-td :props="props">
          <q-chip
            class="glossy"
            :color="props.row.property == '提交任务' ? 'deep-orange' : 'green'"
            text-color="white"
            dense
            square
            :icon="props.row.property == '提交任务' ? 'flag' : 'how_to_vote'"
            >{{ props.row.property }}</q-chip
          >
        </q-td>
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
            >{{ group }}</q-chip
          >
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              round
              dense
              color="secondary"
              :to="`/collections/${props.row.id}`"
              icon="find_in_page"
            />
            <q-btn
              flat
              round
              dense
              color="primary"
              :to="`/collections/edit/${props.row.id}`"
              icon="edit"
            />
            <q-btn
              flat
              round
              dense
              color="red"
              icon="delete"
              @click.stop="removeClt(props.row)"
            />
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
import { getMyCollections, deleteCollection } from 'src/api/collection'
import { formatCltBaseInfo } from 'src/utils/format-clt-data'
export default {
  data () {
    return {
      filter: '',
      loading: true,
      visibleColumns: [
        'title',
        'property',
        'groups',
        'create_time',
        'end_time',
        'status',
        'action'
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
          name: 'property',
          align: 'center',
          label: '收集类型',
          field: 'property',
          sortable: true
        },
        {
          name: 'groups',
          align: 'center',
          label: '所属群组',
          field: 'groups',
          sortable: true
        },
        {
          name: 'create_time',
          align: 'center',
          label: '创建时间',
          field: 'create_time',
          sortable: true
        },
        {
          name: 'end_time',
          align: 'center',
          label: '截止时间',
          field: 'end_time',
          sortable: true
        },
        {
          name: 'status',
          align: 'center',
          label: '进行状态',
          field: 'status',
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
        sortBy: 'create_time',
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
      const { data } = await getMyCollections()
      this.data = formatCltBaseInfo(data)
      console.log(this.data)

      this.$q.loading.hide()
    },
    removeClt ({ title, id }) {
      this.$q
        .dialog({
          title: '请确认',
          message: `删除收集《${title}》，此操作将删除收集及其包含的文件，操作不可恢复！`,
          ok: {
            label: '删除',
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
          await deleteCollection(id)
          await this.fetch()
          this.$q.notify({
            message: '删除成功',
            color: 'positive',
            icon: 'done',
            position: 'center',
            timeout: 1000
          })
        })
        .onCancel(() => {
          this.$q.notify({
            message: '操作取消',
            color: 'warning',
            position: 'center',
            timeout: 1000
          })
        })
    },
    rowClick (evt, row) {
      this.$router.push(`/collections/subInfo/${row.id}`)
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
