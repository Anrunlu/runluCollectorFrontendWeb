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
              :visible-columns="visibleColumns"
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
                  <q-chip dense outline icon="account_box" color="accent">
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-nickname="props">
                <q-td :props="props">
                  <q-chip square dense outline>
                    <q-avatar size="xs">
                      <img :src="props.row.avatar" />
                    </q-avatar>
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                  <q-chip
                    v-if="groupInfo.creator.id == props.value"
                    dense
                    outline
                    color="pink"
                  >
                    创建者
                  </q-chip>
                  <q-chip
                    v-if="managerIdList.includes(props.value)"
                    dense
                    outline
                    color="green"
                  >
                    管理员
                  </q-chip>
                  <q-chip dense outline color="grey">
                    成员
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div
                    class="q-gutter-sm"
                    v-if="groupInfo.creator.id != props.row.id"
                  >
                    <q-btn
                      v-if="!managerIdList.includes(props.row.id)"
                      flat
                      dense
                      color="positive"
                      icon="record_voice_over"
                      @click.stop="onclickSetManager(props.row)"
                      ><q-tooltip>
                        设为管理员
                      </q-tooltip></q-btn
                    >
                    <q-btn
                      v-if="managerIdList.includes(props.row.id)"
                      flat
                      dense
                      color="primary"
                      icon="voice_over_off"
                      @click.stop="onclickRemoveManager(props.row)"
                      ><q-tooltip>
                        取消管理员
                      </q-tooltip></q-btn
                    >
                    <q-btn
                      flat
                      dense
                      color="red"
                      icon="person_remove"
                      @click.stop="onclickRemoveMember(props.row)"
                    >
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
                  <q-item-label>{{ createTime }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions vertical align="right">
            <q-btn
              v-if="roles.includes('creator')"
              icon="delete_forever"
              color="red"
              label="解散群组"
              @click="onclickRemoveGroup"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { getGroupDetail, removeGroup, setManager } from 'src/api/group'
export default {
  props: ['id'],
  data () {
    return {
      filter: '',
      groupInfo: {
        creator: {}
      },
      managerIdList: [],
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
          name: 'roles',
          align: 'center',
          label: '角色',
          field: row => row.id,
          sortable: true
        },
        {
          name: 'action',
          align: 'center',
          label: '操作',
          field: 'action'
        }
      ],
      pagination: {
        sortBy: 'username',
        descending: true,
        rowsPerPage: 10
      }
    }
  },
  computed: {
    roles () {
      const userId = this.$store.getters['user/id']
      const roles = ['member']
      if (this.groupInfo.creator.id === userId) {
        roles.push('creator')
      }
      if (this.managerIdList.includes(userId)) {
        roles.push('manager')
      }
      return roles
    },
    visibleColumns () {
      if (this.roles.includes('creator')) {
        return ['username', 'nickname', 'roles', 'action']
      } else {
        return ['username', 'nickname', 'roles']
      }
    },
    createTime () {
      return date.formatDate(this.groupInfo.createdAt, 'MM/DD HH:mm')
    }
  },
  created () {
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch () {
      const { data } = await getGroupDetail(this.id)
      this.managerIdList = []
      data.manager.reduce((pre, curr, index) => {
        pre.push(curr.id)
        return pre
      }, this.managerIdList)
      this.groupInfo = data
    },
    onclickRemoveGroup () {
      this.$q
        .dialog({
          title: '请确认',
          message: `解散群组《${this.groupInfo.name}》，该操作将删除所有与此群组相关的收集，操作不可恢复！`,
          ok: {
            label: '解散',
            push: true,
            color: 'negative'
          },
          cancel: {
            label: '取消',
            push: true
          },
          persistent: true
        })
        .onOk(async () => {
          await removeGroup(this.groupInfo.id)
          this.$router.replace('/me/groups')
          this.$q.notify({
            type: 'info',
            position: 'center',
            message: '解散群组成功'
          })
          this.fetch()
        })
        .onCancel(() => {
          this.$q.notify({
            message: '操作取消',
            type: 'warning',
            position: 'center',
            timeout: 1000
          })
        })
    },
    onclickRemoveMember (userBaseInfo) {
      this.$q
        .dialog({
          title: '请确认',
          message: `移除成员【${userBaseInfo.nickname}】，操作不可恢复！`,
          ok: {
            label: '移除',
            push: true,
            color: 'negative'
          },
          cancel: {
            label: '取消',
            push: true
          },
          persistent: true
        })
        .onOk(async () => {
          await removeGroup(this.groupInfo.id)
          this.$q.notify({
            type: 'info',
            position: 'center',
            message: '移除成功'
          })
          this.fetch()
        })
        .onCancel(() => {
          this.$q.notify({
            message: '操作取消',
            type: 'warning',
            position: 'center',
            timeout: 1000
          })
        })
    },
    async onclickSetManager (userBaseInfo) {
      await setManager(this.groupInfo.id, userBaseInfo.id, 'set')
      this.$q.notify({
        type: 'positive',
        position: 'center',
        message: '设置成功'
      })
      this.fetch()
    },
    async onclickRemoveManager (userBaseInfo) {
      await setManager(this.groupInfo.id, userBaseInfo.id, 'remove')
      this.$q.notify({
        type: 'positive',
        position: 'center',
        message: '设置成功'
      })
      this.fetch()
    }
  }
}
</script>
