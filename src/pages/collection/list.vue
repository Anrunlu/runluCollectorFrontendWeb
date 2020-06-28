<template>
  <q-page class="q-pa-sm">
    <q-table
      title="收集列表"
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="name"
      :grid="mode=='grid'"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:top-right="props">
        <!-- <q-btn @click="new_customer=true" outline color="primary" label="Add New" class="q-mr-xs" /> -->

        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
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
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >{{props.inFullscreen ? '退出全屏' : '全屏'}}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
          v-if="!props.inFullscreen"
        >
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >{{mode==='grid' ? '列表显示' : '网格显示'}}</q-tooltip>
        </q-btn>

        <!-- <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        /> -->
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="(props.row.status == '进行中')?'green':(props.row.status == '将截止'?'red':'grey')"
            text-color="white"
            dense
            class="text-weight-bolder"
            square
            style="width: 85px"
          >{{props.row.status}}</q-chip>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="new_customer">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Add new change request
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Change Name</q-item-label>
                  <q-input dense outlined v-model="customer.name" label="Change Name" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Change Type</q-item-label>
                  <q-input dense outlined v-model="customer.change_type" label="Change Type" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">New Address Information</q-item-label>
                  <q-input dense outlined v-model="customer.new_address" label="New Address Information" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Status</q-item-label>
                  <q-input dense outlined v-model="customer.status" label="Status" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="Save" type="submit" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import { exportFile } from 'quasar'
// function wrapCsvValue (val, formatFn) {
//   let formatted = formatFn !== 0 ? formatFn(val) : val
//   formatted =
//     formatted === 0 || formatted === null ? '' : String(formatted)
//   formatted = formatted.split('"').join('""')
//   return `"${formatted}"`
// }
export default {
  data () {
    return {
      filter: '',
      customer: {},
      new_customer: false,
      mode: 'list',
      columns: [
        {
          name: 'collection_title',
          align: 'left',
          label: '标题',
          field: 'title',
          sortable: true
        },
        {
          name: 'collection_creator',
          required: true,
          label: '创建者',
          align: 'left',
          field: row => row.creator,
          sortable: true
        },
        {
          name: 'belong_group',
          align: 'left',
          label: '所属群组',
          field: 'group',
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
          field: 'creation_date',
          sortable: true
        }
      ],
      data: [
        {
          change_id: 'C001',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '已截止',
          creation_date: '12-09-2019'
        },
        {
          change_id: 'C002',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '09-02-2019'
        },
        {
          change_id: 'C003',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '03-25-2019'
        },
        {
          change_id: 'C004',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '已截止',
          creation_date: '03-18-2019'
        },
        {
          change_id: 'C005',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '将截止',
          creation_date: '04-09-2019'
        },
        {
          change_id: 'C006',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '09-03-2019'
        },
        {
          change_id: 'C007',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '已截止',
          creation_date: '01-12-2019'
        },
        {
          change_id: 'C008',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '04-15-2019'
        },
        {
          change_id: 'C009',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '11-09-2019'
        },
        {
          change_id: 'C010',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '将截止',
          creation_date: '01-01-2019'
        },
        {
          change_id: 'C011',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '04-12-2019'
        },
        {
          change_id: 'C012',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '已截止',
          creation_date: '10-09-2019'
        },
        {
          change_id: 'C013',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '01-02-2019'
        },
        {
          change_id: 'C014',
          title: '物理实验报告15周',
          creator: '安润鲁',
          group: '智能数据班',
          status: '进行中',
          creation_date: '07-06-2019'
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  methods: {
    // exportTable () {
    //   // naive encoding to csv format
    //   const content = [this.columns.map(col => wrapCsvValue(col.label))]
    //     .concat(
    //       this.data.map(row =>
    //         this.columns
    //           .map(col =>
    //             wrapCsvValue(
    //               typeof col.field === 'function'
    //                 ? col.field(row)
    //                 : row[col.field === 0 ? col.name : col.field],
    //               col.format
    //             )
    //           )
    //           .join(',')
    //       )
    //     )
    //     .join('\r\n')
    //   const status = exportFile('change-request.csv', content, 'text/csv')
    //   if (status !== true) {
    //     this.$q.notify({
    //       message: 'Browser denied file download...',
    //       color: 'negative',
    //       icon: 'warning'
    //     })
    //   }
    // }
  }
}
</script>
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
