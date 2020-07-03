<template>
  <q-page padding>
    <div class="row q-gutter-md justify-center items-start">
      <div class="col-md-8 col-11">
        <q-card class="my-card content-card">
          <q-card-section>
            <div class="text-h5">{{ cltDetail.title }}</div>
            <q-chip class="q-mt-md" size="sm" outline color="purple">
              <q-avatar icon="person" color="purple" text-color="white" />
              {{ cltDetail.creator }}
            </q-chip>
            <q-chip
              class="q-mt-md"
              outline
              color="purple"
              text-color="white"
              icon="event"
              size="sm"
            >
              创建时间：{{ cltDetail.create_time }}
            </q-chip>
            <q-chip class="q-mt-md" size="sm" clickable>
              <q-avatar color="green" text-color="white">50</q-avatar>
              已提交人数
            </q-chip>
          </q-card-section>

          <q-separator inset />

          <q-card-section v-html="cltDetail.description"> </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-chip
              square
              outline
              color="primary"
              text-color="white"
              icon="alarm"
              size="sm"
            >
              截止时间：{{ cltDetail.end_time }}
            </q-chip>
          </q-card-section>
        </q-card>

        <q-card class="my-card upload-card q-mt-md">
          <q-card-section>文件上传区域</q-card-section>
          <q-card-section
            ><q-file
              v-model="file"
              label="选择或拖拽文件于此"
              outlined
              rounded
              use-chips
              counter
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template> </q-file
          ></q-card-section>
          <q-card-section>
            <q-btn
              class="full-width"
              color="green"
              outline
              :loading="btnLoading"
              icon="cloud_upload"
              label="提交文件"
              @click="onClickSubmitFile"
            >
              <template v-slot:loading>
                <q-linear-progress
                  stripe
                  size="35px"
                  :value="progress"
                  track-color="white"
                  color="green"
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="accent"
                      text-color="white"
                      :label="progressLabel"
                    />
                  </div>
                </q-linear-progress>
              </template>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <q-card class="my-card col-md-3 desktop-only">
        <q-table
          title="已提交名单"
          :data="subdata"
          :columns="columns"
          row-key="name"
        />
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { getCollectionInfo } from 'src/api/collection'
import { formatSingleCltDetail } from 'src/utils/format-clt-data'

export default {
  props: ['id'],
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: '姓名',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'subtime', align: 'center', label: '时间', field: 'subtime', sortable: true }
      ],
      subdata: [
        { name: '张三', subtime: '07/02 20:33' },
        { name: '李四', subtime: '07/02 20:34' },
        { name: '王五', subtime: '07/02 20:35' }
      ],
      btnLoading: false,
      progress: 0.33,
      file: null,
      cltDetail: {}
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    progressLabel () {
      return (this.progress * 100).toFixed(2) + '%'
    }
  },
  methods: {
    async fetch () {
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data } = await getCollectionInfo(this.id, { mode: 'detail' })
      this.cltDetail = formatSingleCltDetail(data)
      console.log(this.cltDetail)
      this.$q.loading.hide()
    },
    onClickSubmitFile () {
      this.btnLoading = true
      setTimeout(() => {
        this.btnLoading = false
      }, 2000)
    }
  }
}
</script>
<style scoped>
/* .content-card{
  border:1px solid rgb(39, 172, 39)
} */
</style>
