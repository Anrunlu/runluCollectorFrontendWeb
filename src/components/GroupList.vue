<template>
  <q-table
    :title="title"
    :data="data"
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
        color="green"
        :size="$q.platform.is.mobile ? 'md' : 'lg'"
        text-color="white"
        icon="people"
      >
        {{ title }}
      </q-chip>
    </template>

    <template v-slot:top-right="props">
      <q-input
        class="desktop-only"
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
      >
        <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
          props.inFullscreen ? "退出全屏" : "全屏"
        }}</q-tooltip>
      </q-btn>

      <q-btn flat round dense icon="refresh">
        <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
          刷新
        </q-tooltip>
      </q-btn>
    </template>

    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <q-chip
          class="glossy"
          color="primary"
          text-color="white"
          dense
          square
          >{{ props.row.name }}</q-chip
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
            v-if="title!=='加入的群组'"
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
            :icon="title!=='创建的群组'?'exit_to_app':'delete'"
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
</template>

<script>
export default {
  name: 'GroupList',
  props: ['data', 'visibleColumns', 'columns', 'title'],
  data () {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  methods: {
    rowClick (evt, row) {
      this.$router.push(`/groups/${row.id}`)
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
