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
      <q-tab icon="people" name="joinedGroups" label="我加入的">
        <q-badge color="primary" floating transparent>{{
          joinedGroups.length
        }}</q-badge>
      </q-tab>
      <q-tab
        icon="supervised_user_circle"
        name="createdGroups"
        label="我创建的"
      >
        <q-badge color="primary" floating transparent>{{
          createdGroups.length
        }}</q-badge>
      </q-tab>
      <q-tab icon="record_voice_over" name="managedGroups" label="我管理的">
        <q-badge color="primary" floating transparent>{{
          managedGroups.length
        }}</q-badge>
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-grey-1">
      <q-tab-panel name="joinedGroups">
        <GroupList
          :data="joinedGroups"
          :visibleColumns="visibleColumns"
          :columns="columns"
          :title="`加入的群组`"
          @leaveGroup="listenLeaveGroup"
        ></GroupList>
      </q-tab-panel>

      <q-tab-panel name="createdGroups">
        <GroupList
          :data="createdGroups"
          :visibleColumns="visibleColumns"
          :columns="columns"
          :title="`创建的群组`"
          @removeGroup="listenRemoveGroup"
        ></GroupList>
      </q-tab-panel>

      <q-tab-panel name="managedGroups">
        <GroupList
          :data="managedGroups"
          :visibleColumns="visibleColumns"
          :columns="columns"
          :title="`管理的群组`"
          @leaveGroup="listenLeaveGroup"
        ></GroupList>
      </q-tab-panel>
    </q-tab-panels>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-model="fab"
        label-position="right"
        push
        color="red"
        icon="add"
        direction="left"
      >
        <q-fab-action
          color="primary"
          icon="group_add"
          label="创建群组"
          @click="createGroupPrompt = true"
        />
        <q-fab-action
          color="secondary"
          icon="add_circle"
          label="加入群组"
          @click="addGroupPrompt = true"
        />
      </q-fab>
    </q-page-sticky>

    <q-dialog v-model="addGroupPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">输入群组名称</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="joinGroupName"
            autofocus
            @keyup.enter="addGroupPrompt = false"
            :rules="[checkGroup]"
          >
            <template v-slot:prepend> <q-icon name="people" /> </template
          ></q-input>
          <q-input
            v-if="checkedGroup.exist"
            v-model="checkedGroup.group.creator.nickname"
            type="text"
            label="创建者"
            disable
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn
            flat
            label="加入群组"
            :disable="!checkedGroup.exist"
            v-close-popup
            @click="onClickJoinGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createGroupPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">输入群组名称</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="createGroupName"
            autofocus
            @keyup.enter="addGroupPrompt = false"
            :rules="[checkGroupName]"
          >
            <template v-slot:prepend> <q-icon name="people" /> </template
          ></q-input>
          <q-input
            v-if="checkedGroup.exist"
            v-model="checkedGroup.group.creator.nickname"
            type="text"
            label="创建者"
            disable
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn
            flat
            label="创建群组"
            :disable="disableCreateGroupBtn"
            v-close-popup
            @click="onClickCreateGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { isGroupExist } from 'src/api/query'
import { getGroupList, createGroup, joinGroup, leaveGroup, removeGroup } from 'src/api/group'
import GroupList from 'components/GroupList'

export default {
  components: {
    GroupList
  },
  data () {
    return {
      addGroupPrompt: false,
      createGroupPrompt: false,
      disableCreateGroupBtn: true,
      checkedGroup: {
        exist: false
      },
      joinGroupName: '',
      createGroupName: '',
      fab: false,
      tab: 'joinedGroups',
      filter: '',
      visibleColumns: ['name', 'action'],
      columns: [
        {
          name: 'name',
          align: 'left',
          label: '名称',
          field: 'name',
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
      joinedGroups: [],
      createdGroups: [],
      managedGroups: [],
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
      const { data: joinedGroups } = await getGroupList({ type: 'joined' })
      const { data: createdGroups } = await getGroupList({ type: 'created' })
      const { data: managedGroups } = await getGroupList({ type: 'managed' })

      this.joinedGroups = joinedGroups
      this.createdGroups = createdGroups
      this.managedGroups = managedGroups

      // this.underwayTasks = formatCltBaseInfo(underwayTasks)
      // this.closedTasks = formatCltBaseInfo(closedTasks)
      // this.allTasks = formatCltBaseInfo(allTasks)
      this.$q.loading.hide()
    },
    async onClickJoinGroup () {
      await joinGroup(this.checkGroup.id)
      this.$q.notify({
        type: 'positive',
        position: 'center',
        message: '加入群组成功'
      })
      this.fetch()
    },
    async listenLeaveGroup (groupBaseInfo) {
      this.$q
        .dialog({
          title: '请确认',
          message: `退出群组《${groupBaseInfo.name}》，退出后你将不在收到该群组有关消息，是否确认退出`,
          ok: {
            label: '退出',
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
          await leaveGroup(groupBaseInfo.id)
          this.$q.notify({
            type: 'info',
            position: 'center',
            message: '退出群组成功'
          })
          this.fetch()
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

    async listenRemoveGroup (groupBaseInfo) {
      this.$q
        .dialog({
          title: '请确认',
          message: `解散群组《${groupBaseInfo.name}》，该操作将删除所有与此群组相关的收集，操作不可恢复！`,
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
          await removeGroup(groupBaseInfo.id)
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
            color: 'warning',
            position: 'center',
            timeout: 1000
          })
        })
    },

    async onClickCreateGroup () {
      const { data } = await createGroup({
        name: this.createGroupName,
        org: this.$store.getters['user/orgId'],
        creator: this.$store.getters['user/id']
      })
      await joinGroup(data.id)
      this.$q.notify({
        type: 'positive',
        position: 'center',
        message: '群组创建成功'
      })
      this.fetch()
    },
    checkGroup (val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          isGroupExist(val).then(res => {
            if (res.data.exist) {
              this.checkedGroup = res.data
              resolve(true)
            } else {
              this.checkedGroup = res.data
              resolve('群组不存在')
            }
          })
        }, 1000)
      })
    },
    checkGroupName (val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          isGroupExist(val).then(res => {
            if (!res.data.exist) {
              if (val.length < 4) {
                this.disableCreateGroupBtn = true
                resolve('名称过短')
              } else {
                this.disableCreateGroupBtn = false
                resolve(true)
              }
            } else {
              this.disableCreateGroupBtn = true
              resolve('该名称已被占用')
            }
          })
        }, 1000)
      })
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
