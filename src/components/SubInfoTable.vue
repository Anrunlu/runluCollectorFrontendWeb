<template>
  <q-table
    title="已提交名单"
    :data="posts"
    :columns="columns"
    row-key="name"
    :pagination="pagination"
    rows-per-page-label="每页展示数量"
    :rows-per-page-options="[5, 10]"
  >
    <template v-slot:top-left>
      <q-chip square size="md">
        <q-avatar color="green" text-color="white" icon="move_to_inbox"></q-avatar>
        已提交人数 {{posts.length}}
      </q-chip>
    </template>

    <template v-slot:no-data="">
      <div class="full-width row flex-center text-grey q-gutter-sm">
        <span class="text-h6">
          暂无数据
        </span>
      </div>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'SubInfoTable',
  props: ['posts'],
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
        rowsPerPage: 5
      }
    }
  }
}
</script>
