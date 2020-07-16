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
        <q-tab icon="done" name="submitted" label="已提交">
          <q-badge color="positive" floating transparent>{{
            submitted.length
          }}</q-badge>
        </q-tab>
        <q-tab icon="clear" name="nosubmit" label="未提交">
          <q-badge color="negative" floating transparent>{{
            unSubmitted.length
          }}</q-badge>
        </q-tab>
        <q-tab icon="notes" name="all" label="全部">
          <q-badge color="primary" floating transparent>{{
            all.length
          }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
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
              <q-btn
                color="primary"
                icon="get_app"
                label="打包下载"
                @click="onClickPackZip"
              />
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
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
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
                  <a :href="props.row.fileUrl"
                    ><q-btn dense color="primary" icon="get_app"
                  /></a>
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
                color="secondary"
                icon="notifications_active"
                label="一键提醒"
                @click="onClickPackZip"
              />
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
                  <q-btn dense color="secondary" icon="notifications" />
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
            title="未提交"
            :data="all"
            :columns="allColumns"
            row-key="name"
            :filter="filter"
            :pagination="pagination"
            rows-per-page-label="单页条目数"
            no-data-label="暂无任务"
          >
            <template v-slot:top-left>
              <q-btn
                color="secondary"
                icon="notifications_active"
                label="一键提醒"
                @click="onClickPackZip"
              />
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
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
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
  </q-page>
</template>

<script>
import { getCltSubInfo } from 'src/api/query'
import { getCollectionInfo } from 'src/api/collection'
import { formatSinglePostDetail } from '../../utils/format-post-data'
export default {
  props: ['id'],
  data () {
    return {
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
    onClickPackZip () {
      console.log('按下打包下载')
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
