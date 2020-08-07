<template>
  <q-page class="q-pa-sm q-pt-md">
    <q-card>
      <q-chip
        class="glossy q-my-sm q-pa-md"
        icon="folder_open"
        :label="cltTitle"
        color="accent"
        text-color="white"
      />
      <q-select
        class="q-mb-lg"
        dense
        v-model="currgroup"
        :options="groupOptions"
        label="选择群组"
        option-label="name"
        option-value="_id"
        standout="bg-primary text-white"
      >
        <template v-slot:prepend> <q-icon name="people" /> </template
      ></q-select>

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
        <q-tab icon="done" name="submitted" :ripple="false" label="已提交">
          <q-badge color="positive" floating transparent>{{
            submitted.length
          }}</q-badge>
        </q-tab>
        <q-tab icon="clear" name="nosubmit" :ripple="false" label="未提交">
          <q-badge color="negative" floating transparent>{{
            unSubmitted.length
          }}</q-badge>
        </q-tab>
        <q-tab icon="notes" name="all" :ripple="false" label="全部">
          <q-badge color="primary" floating transparent>{{
            all.length
          }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="submitted">
          <q-table
            class="no-shadow"
            title="已提交"
            :data="submitted"
            :columns="submittedColumns"
            row-key="name"
            :filter="filter"
            :pagination="pagination"
            rows-per-page-label="单页条目数"
            no-data-label="暂无任务"
          >
            <template v-slot:top-left>
              <div class="q-gutter-sm">
                <q-btn
                  :disable="submitted.length <= 0"
                  color="primary"
                  icon="get_app"
                  label="打包下载"
                  @click="onClickPackZip"
                />
                <q-btn
                  color="primary"
                  icon="edit"
                  label="设置重命名规则"
                  @click="renameRulesRadio"
                />
              </div>
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
                <q-chip dense outline icon="account_box" color="primary">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-nickname="props">
              <q-td :props="props">
                <q-chip square dense outline>
                  <q-avatar size="xs">
                    <img :src="props.row.creator.avatar" />
                  </q-avatar>
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-origname="props">
              <q-td :props="props">
                <q-chip
                  icon="insert_drive_file"
                  outline
                  dense
                  color="teal"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="q-gutter-sm">
                  <q-btn
                    dense
                    color="primary"
                    icon="get_app"
                    @click.stop="downloadSingleFile(props.row)"
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
        </q-tab-panel>

        <q-tab-panel name="nosubmit">
          <q-table
            class="no-shadow"
            title="未提交"
            :data="unSubmitted"
            :columns="unSubmittedColumns"
            row-key="name"
            :filter="filter"
            :pagination="pagination"
            rows-per-page-label="单页条目数"
            no-data-label="暂无任务"
          >
            <template v-slot:top-left>
              <q-btn
                v-if="unSubmitted.length > 0"
                color="secondary"
                icon="notifications_active"
                label="一键提醒"
                @click="onClickSendNotifyToGroup"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[10, 10]"
                >
                  发送提醒到钉钉群 <q-icon name="send" />
                </q-tooltip>
              </q-btn>
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
                <q-chip dense outline icon="account_box" color="secondary">
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

            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="q-gutter-sm">
                  <q-btn
                    dense
                    color="secondary"
                    icon="notifications"
                    @click.stop="onClickSendNotifyToOne(props.row._id)"
                  >
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
        </q-tab-panel>

        <q-tab-panel name="all">
          <q-table
            class="no-shadow"
            title="全部"
            :data="all"
            :columns="allColumns"
            row-key="name"
            :filter="filter"
            :pagination="pagination"
            rows-per-page-label="单页条目数"
            no-data-label="暂无任务"
          >
            <!-- <template v-slot:top-left>
              <q-btn
                color="secondary"
                icon="notifications_active"
                label="一键提醒"
                @click="onClickSendNotifyToGroup"
              />
            </template> -->

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
                <q-chip dense outline icon="account_box" color="secondary">
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
            <!-- <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <div class="q-gutter-sm">
                  <q-btn dense color="secondary" icon="notifications" />
                </div>
              </q-td>
            </template> -->

            <template v-slot:no-data="">
              <div class="full-width row flex-center text-grey q-gutter-sm">
                <span class="text-h6">
                  暂无数据
                </span>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-dialog
      v-model="mkzipSuccessDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">打包成功</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          请点击下方的按钮进行下载
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            icon="get_app"
            label="下载"
            v-close-popup
            @click.stop="downloadZipFile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getCltSubInfo } from 'src/api/query'
import { getCollectionInfo } from 'src/api/collection'
import { sendNotifyToOne, sendDingTalkRemindMsg } from 'src/api/message'
import { formatSinglePostDetail } from '../../utils/format-post-data'
import { saveAs } from 'file-saver'
import { QSpinnerGears } from 'quasar'
export default {
  props: ['id'],
  data () {
    return {
      mkzipSuccessDialog: false,
      zipFileUrl: '',
      renameRule: 1,
      tab: 'submitted',
      cltTitle: '',
      currgroup: null,
      groupOptions: [],
      filter: '',
      loading: true,
      submittedColumns: [
        {
          name: 'username',
          align: 'left',
          label: '学号',
          field: row => row.creator.username,
          sortable: true
        },
        {
          name: 'nickname',
          align: 'left',
          label: '姓名',
          field: row => row.creator.nickname,
          sortable: true
        },
        {
          name: 'origname',
          align: 'center',
          label: '文件名',
          field: 'origname',
          sortable: true
        },
        {
          name: 'updatedAt',
          align: 'left',
          label: '最后提交时间',
          field: 'updatedAt',
          sortable: true
        },
        {
          name: 'action',
          align: 'left',
          label: '操作',
          field: 'action',
          sortable: true
        }
      ],
      unSubmittedColumns: [
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
      allColumns: [
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
        }
      ],
      submitted: [],
      unSubmitted: [],
      all: [],
      pagination: {
        sortBy: 'updatedAt',
        descending: true,
        rowsPerPage: 10
      }
    }
  },
  async created () {
    await this.fetchBase()
    await this.fetchSubInfo('submitted')
    await this.fetchSubInfo('unSubmitted')
    await this.fetchSubInfo('all')
  },
  watch: {
    async currgroup () {
      await this.fetchSubInfo('submitted')
      await this.fetchSubInfo('unSubmitted')
      await this.fetchSubInfo('all')
    }
  },
  sockets: {
    connect () {},
    mkzipStart: function (data) {
      // 监听message事件，方法是后台定义和提供的
      if (data.success) {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'white',
          messageColor: 'white',
          backgroundColor: 'black',
          message: '云端打包中，打包时长取决于文件总体积，请耐心等待...'
        })
      } else {
        this.$q.notify({
          type: 'negative',
          message: '打包失败，请稍后再试'
        })
      }
    },
    mkzipEnd: function (data) {
      if (data.success) {
        this.$q.loading.hide()
        this.zipFileUrl = process.env.QINIUCDN + data.key
        this.mkzipSuccessDialog = true
      } else {
        this.$q.loading.hide()
        this.$q.notify({
          type: 'negative',
          message: '打包失败，请联系管理员'
        })
      }
    }
  },
  methods: {
    async fetchBase () {
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data: cltInfo } = await getCollectionInfo(this.id, {
        mode: 'titleAndGruops'
      })
      this.cltTitle = cltInfo.title
      this.groupOptions = cltInfo.groups
      this.currgroup = this.groupOptions[0]
      this.$q.loading.hide()
    },
    async fetchSubInfo (subDataType) {
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data } = await getCltSubInfo(
        this.id,
        this.currgroup.id,
        subDataType
      )
      data.forEach(post => {
        formatSinglePostDetail(post)
      })
      this[subDataType] = data
      this.$q.loading.hide()
    },
    async onClickSendNotifyToOne (userId) {
      await sendNotifyToOne(this.id, userId)
      this.$q.notify({
        message: '提醒成功，请不要频繁发送',
        color: 'positive',
        position: 'center',
        timeout: 4000,
        avatar: 'https://cltdownload.anrunlu.net/2019414172-1595575822881.png',
        actions: [
          {
            label: '知道了',
            color: 'yellow',
            handler: () => {
              /* ... */
            }
          }
        ]
      })
    },
    async onClickSendNotifyToGroup () {
      await sendDingTalkRemindMsg(this.id, this.currgroup._id)
      this.$q.notify({
        message: '提醒成功，请不要频繁发送',
        color: 'positive',
        position: 'center',
        timeout: 10000,
        avatar: 'https://cltdownload.anrunlu.net/2019414172-1595575822881.png',
        actions: [
          {
            label: '知道了',
            color: 'yellow',
            handler: () => {
              /* ... */
            }
          }
        ]
      })
    },
    onClickPackZip () {
      this.$socket.emit('mkzip', {
        cltId: this.id,
        renameRule: this.renameRule
      })
    },
    downloadSingleFile (postInfo) {
      let renameTemplate = ''
      if (this.renameRule === 1) {
        renameTemplate = `${postInfo.creator.username}-${postInfo.creator.nickname}`
      } else if (this.renameRule === 2) {
        renameTemplate = `${this.cltTitle}-${postInfo.creator.username}-${postInfo.creator.nickname}`
      } else {
        renameTemplate = postInfo.origname
      }
      saveAs(postInfo.fileUrl, renameTemplate)
    },
    downloadZipFile () {
      this.$q.notify({
        message:
          '已启动下载，压缩包名称默认同收集标题，下载时长取决于文件体积，请耐心等待...',
        color: 'positive',
        position: 'top-right',
        multiLine: true,
        timeout: 10000,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        actions: [
          {
            label: '知道了',
            color: 'yellow',
            handler: () => {
              /* ... */
            }
          }
        ]
      })
      saveAs(this.zipFileUrl, `${this.cltTitle}.zip`)
    },
    renameRulesRadio () {
      this.$q
        .dialog({
          title: '设置重命名规则',
          message: '请设置单个文件重命名规则:',
          options: {
            type: 'radio',
            model: this.renameRule,
            items: [
              { label: '学(工)号—姓名', value: 1 },
              { label: '收集标题—学(工)号—姓名', value: 2 },
              { label: '学(工)号-姓名-文件原始名称', value: 3 }
            ]
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.renameRule = data
        })
    }
  }
}
</script>
<style scoped>
a {
  text-decoration: none;
}
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
