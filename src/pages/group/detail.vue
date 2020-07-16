<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="my-card">
          <q-card-section>
            <q-table
              class="no-shadow"
              title="已提交"
              :data="groupInfo.members"
              :columns="columns"
              row-key="username"
              :filter="filter"
              :pagination="pagination"
              rows-per-page-label="单页条目数"
              no-data-label="暂无任务"
            >
              <template v-slot:top-left>
                <q-btn color="primary" icon="people" :label="groupInfo.name" />
              </template>

              <template v-slot:top-right>
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
              </template>

              <template v-slot:body-cell-username="props">
                <q-td :props="props">
                  <q-chip
                    dense
                    outline
                    icon="account_box"
                    color="accent"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-nickname="props">
                <q-td :props="props">
                  <q-chip square dense outline>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn flat dense color="primary" icon="record_voice_over"
                      ><q-tooltip>
                        设为管理者
                      </q-tooltip></q-btn
                    >
                    <q-btn flat dense color="red" icon="person_remove">
                      <q-tooltip>
                        移除成员
                      </q-tooltip>
                    </q-btn>
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
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">基本信息</div>
            <q-list separator class="q-mt-sm">
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label caption>创建者</q-item-label>
                  <q-item-label>{{ groupInfo.creator.nickname }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label caption>创建时间</q-item-label>
                  <q-item-label>{{ groupInfo.createdAt }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="right">
            <q-btn icon="delete_forever" color="red" label="解散群组" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getGroupDetail } from 'src/api/group'
export default {
  props: ['id'],
  data () {
    return {
      filter: '',
      groupInfo: {
        creator: {}
      },
      columns: [
        {
          name: 'username',
          align: 'left',
          label: '学号',
          field: row => row.username,
          sortable: true
        },
        {
          name: 'nickname',
          align: 'left',
          label: '姓名',
          field: row => row.nickname,
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
      pagination: {
        sortBy: 'username',
        descending: true,
        rowsPerPage: 10
      }
    }
  },
  created () {
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch () {
      const { data } = await getGroupDetail(this.id)
      console.log(data)
      this.groupInfo = data
    }
  }
}
</script>
