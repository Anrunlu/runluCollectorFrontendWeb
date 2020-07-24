<template>
  <q-table
    :title="title"
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
      <q-chip
        square
        color="green"
        :size="$q.platform.is.mobile ? 'md' : 'lg'"
        text-color="white"
        icon="topic"
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

    <template v-slot:body-cell-title="props">
      <q-td :props="props">
        <q-chip square dense outline icon="toc" color="secondary">
          {{ props.value }}
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-creator="props">
      <q-td :props="props">
        <q-chip square dense outline>
          <q-avatar size="xs">
            <img :src="props.row.creator.avatar" />
          </q-avatar>
          {{ props.value.nickname }}
        </q-chip>
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
  props: ['data', 'visibleColumns', 'columns', 'title'],
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
