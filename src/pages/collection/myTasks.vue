<template>
  <q-page class="q-pa-sm q-pt-md">
    <CollectionList :data="data" :visibleColumns="visibleColumns" :columns="columns"></CollectionList>
  </q-page>
</template>

<script>
import { getMyTasks } from 'src/api/query'
import { formatCltBaseInfo } from 'src/utils/format-clt-data'
import CollectionList from 'components/CollectionList'

export default {
  components: {
    CollectionList
  },
  data () {
    return {
      filter: '',
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
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data } = await getMyTasks()
      this.data = formatCltBaseInfo(data)
      this.$q.loading.hide()
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
