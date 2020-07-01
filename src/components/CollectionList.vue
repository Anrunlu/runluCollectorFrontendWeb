<template>
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
      rows-per-page-label="单页条目数"
      no-data-label="暂无任务"
      @row-click="rowClick"
    >

      <template v-slot:top-left>
        <q-chip square color="green" size="lg" text-color="white" icon="topic">
          任务列表
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

        <q-btn
          flat
          round
          dense
          icon="refresh"

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
</template>

<script>
export default {
  name: 'CollectionList',
  props: ['data', 'visibleColumns', 'columns'],
  data () {
    return {
      filter: '',
      mode: 'list',
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  methods: {
    rowClick (evt, row) {
      console.log(row)
      this.$router.push(`/collections/${row.id}`)
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
