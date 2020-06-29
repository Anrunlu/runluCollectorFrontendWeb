<template>
  <q-page class="q-pa-sm q-pt-md">
    <q-card class="my-card">
      <q-card-section class="row justify-start">
        <div class="col">
          <q-chip
            square
            color="primary"
            size="md"
            text-color="white"
            icon="create_new_folder"
          >
            创建收集
          </q-chip>
          <q-chip outline color="teal" text-color="white" icon="bookmark">
            欢迎您，{{ nickname }}
          </q-chip>
        </div>

        <q-btn-toggle
          v-model="model.property"
          push
          glossy
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="property"
        />
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md row justify-center">
          <q-input
            standout="bg-primary text-white"
            v-model="model.title"
            label="收集标题"
            class="col-md-6 col-11"
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>

          <q-select
            standout="bg-primary text-white"
            class="col-md-5 col-11"
            v-model="model.groups"
            multiple
            :options="groups"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            use-chips
            label="选择群组"
          >
            <template v-slot:prepend>
              <q-icon name="people" />
            </template>
          </q-select>

          <q-select
            standout="bg-primary text-white"
            class="col-md-6 col-11"
            v-model="model.fileformat"
            multiple
            :options="fileformats"
            use-chips
            label="选择文件类型"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-select>

          <q-input
            label="截止时间(点击两侧图标选择时间)"
            class="col-md-5 col-11"
            standout="bg-primary text-white"
            v-model="pickedtime"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="pickedtime" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time
                    v-model="pickedtime"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-editor
            class="col-xs-11 col-md-11"
            placeholder="添加收集描述/说明..."
            v-model="model.description"
            min-height="15rem"
            flat
            content-class="bg-grey-1"
            toolbar-text-color="white"
            toolbar-toggle-color="yellow-8"
            toolbar-bg="primary"
            :toolbar="[
              ['bold', 'italic', 'underline'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
                }
              ]
            ]"
          />

          <div class="col-12 row justify-center">
            <q-btn
              class="col-5 col-md-2"
              label="确认创建收集"
              type="submit"
              color="primary"
              :loading="loadingBtn"
            />
            <q-btn
              label="重置"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { createCollection } from 'src/api/collection'
import { getMyAccessableGroups } from 'src/api/query'
export default {
  computed: {
    ...mapGetters({
      userId: 'user/id',
      orgId: 'user/orgId',
      nickname: 'user/nickname'
    })
  },
  data () {
    return {
      loadingBtn: false,
      model: {
        title: '',
        creator: '',
        property: 'private',
        org: '',
        description: '',
        groups: [],
        fileformat: [],
        endtime: ''
      },
      pickedtime: '',
      groups: [],
      fileformats: ['文档', '图片', '视频', '压缩包', '所有文件'],
      property: [
        { label: '任务收集', value: 'private' },
        { label: '公开征集', value: 'public' }
      ]
    }
  },
  created () {
    this.getAccessableGroups()
  },
  methods: {
    async getAccessableGroups () {
      const { data } = await getMyAccessableGroups()
      this.groups = data
    },
    async onSubmit () {
      this.model.creator = this.userId
      this.model.org = this.orgId
      this.model.endtime = new Date(this.pickedtime)
      this.model.firetime = Date.now()

      this.loadingBtn = true
      this.$q.loading.show({
        message: '正在创建...'
      })
      try {
        await createCollection(this.model)
        this.loadingBtn = false
        this.$q.loading.hide()
        this.$q.notify({
          message: '创建成功',
          color: 'positive',
          icon: 'done',
          position: 'center',
          timeout: 2000
        })
        this.$router.replace('/collections/myTasks')
      } catch (error) {
        this.loadingBtn = false
        this.$q.notify({
          message: '创建失败，请稍后再试',
          color: 'red',
          icon: 'error',
          position: 'center',
          timeout: 2000
        })
      }
    },
    onReset () {
      this.model.title = ''
      this.model.description = ''
      this.model.groups = []
      this.model.fileformat = []
      this.pickedtime = ''
    }
  }
}
</script>
<style scoped>
/* .q-card {
  background-image: linear-gradient( 135deg, #FFF720 10%, #3CD500 100%);
} */
</style>
