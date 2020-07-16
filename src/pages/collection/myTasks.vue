<template>
  <q-page class="q-pa-sm q-pt-md">
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
      <q-tab icon="alarm" name="underwayTasks" label="进行中">
        <q-badge color="positive" floating transparent>{{
          underwayTasks.length
        }}</q-badge>
      </q-tab>
      <q-tab icon="alarm_on" name="closedTasks" label="已截止">
        <q-badge color="grey" floating transparent>{{
          closedTasks.length
        }}</q-badge>
      </q-tab>
      <q-tab icon="notes" name="allTasks" label="全部">
        <q-badge color="primary" floating transparent>{{
          allTasks.length
        }}</q-badge>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-grey-1">
      <q-tab-panel name="underwayTasks" class="row justify-center q-gutter-md">
        <div class="text-h5" v-if="underwayTasks.length===0">
          暂无进行中的任务
        </div>
        <q-card
          class="col-md-3 col-11"
          v-for="task in underwayTasks"
          :key="task.id"
        >
          <q-card-section>
            <q-chip square size="md" class="bg-blue-grey-1">
              <q-avatar
                :icon="task.property === '提交任务' ? 'flag' : 'how_to_vote'"
                :color="task.property == '提交任务' ? 'deep-orange' : 'green'"
                text-color="white"
              />
              {{ task.title }}
            </q-chip>
            <q-list separator class="q-mt-xs">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>

                <q-item-section>{{ task.creator }}</q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>

                <q-item-section
                  >发布时间：{{ task.create_time }}</q-item-section
                >
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>

                <q-item-section>
                  <div class="text-subtitle2">
                    {{ task.groups.join("，") }}
                  </div>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="alarm" />
                </q-item-section>

                <q-item-section
                  ><q-linear-progress
                    size="20px"
                    :value="task.cycleRate * 1"
                    :color="task.cycleRate >= 0.1 ? 'green' : 'negative'"
                    stripe
                    rounded
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="accent"
                        :label="`${task.diffToEnd}小时后截止`"
                      />
                    </div> </q-linear-progress
                ></q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              class="full-width"
              flat
              label="进入收集"
              icon="chrome_reader_mode"
              @click="$router.push(`/collections/${task.id}`)"
            />
          </q-card-actions>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="closedTasks">
        <CollectionList
          :data="closedTasks"
          :visibleColumns="visibleColumns"
          :columns="columns"
          :title="`已截止的任务`"
        ></CollectionList>
      </q-tab-panel>

      <q-tab-panel name="allTasks">
        <CollectionList
          :data="allTasks"
          :visibleColumns="visibleColumns"
          :columns="columns"
          :title="`全部任务`"
        ></CollectionList>
      </q-tab-panel>
    </q-tab-panels>
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
      tab: 'underwayTasks',
      filter: '',
      mode: 'list',
      visibleColumns: [
        'title',
        'property',
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
          name: 'property',
          required: true,
          label: '收集类型',
          align: 'center',
          field: row => row.property,
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
      underwayTasks: [],
      closedTasks: [],
      allTasks: [],
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
      const { data: underwayTasks } = await getMyTasks({ type: 'underway' })
      const { data: closedTasks } = await getMyTasks({ type: 'closed' })
      const { data: allTasks } = await getMyTasks({ type: 'all' })

      console.log(allTasks)

      this.underwayTasks = formatCltBaseInfo(underwayTasks)
      this.closedTasks = formatCltBaseInfo(closedTasks)
      this.allTasks = formatCltBaseInfo(allTasks)
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
