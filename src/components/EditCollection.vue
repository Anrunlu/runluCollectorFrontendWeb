<template>
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
          {{ mode === "create" ? "创建收集" : "修改收集" }}
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
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md row justify-center"
      >
        <q-input
          filled
          v-model="model.title"
          label="收集标题"
          class="col-md-6 col-11"
          :rules="[val => !!val || '请输入收集标题']"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon name="subject" />
          </template>
        </q-input>

        <q-select
          filled
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
          :rules="[val => val.length > 0 || '请选择群组']"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon name="people" />
          </template>
        </q-select>

        <q-select
          filled
          class="col-md-6 col-11"
          v-model="model.fileformat"
          multiple
          :options="fileformats"
          use-chips
          label="选择文件类型"
          :rules="[val => val.length > 0 || '请选择文件类型']"
          hide-bottom-space
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-select>

        <q-input
          filled
          label="截止时间(点击两侧图标选择时间)"
          class="col-md-5 col-11"
          v-model="pickedtime"
          :rules="[val => !!val || '请选择时间']"
          hide-bottom-space
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
            :label="mode === 'create' ? '创建' : '修改并保存'"
            type="submit"
            color="primary"
            :loading="loadingBtn"
          />
          <q-btn
            v-if="mode === 'create'"
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
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getCollectionInfo,
  createCollection,
  updateCollection
} from 'src/api/collection'
import { getMyAccessableGroups } from 'src/api/query'
import { date } from 'quasar'
export default {
  props: ['mode', 'id'],
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
    console.log(this.mode, this.id)
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.$q.loading.show({
        message: '加载中...'
      })
      const { data: groups } = await getMyAccessableGroups()
      this.groups = groups
      if (this.id) {
        const { data: model } = await getCollectionInfo(this.id)
        this.model = model
        this.pickedtime = date.formatDate(model.endtime, 'YYYY-MM-DD HH:mm')
      }
      this.$q.loading.hide()
    },

    async onSubmit () {
      if (this.mode === 'create') {
        console.log('创建')

        this.model.creator = this.userId
        this.model.org = this.orgId
        this.model.endtime = new Date(this.pickedtime)
        // 此处设置失效时间
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
          this.$q.loading.hide()
          this.$q.notify({
            message: '创建失败，请稍后再试',
            color: 'red',
            icon: 'error',
            position: 'center',
            timeout: 2000
          })
        }
      } else if (this.mode === 'edit' && this.id) {
        // 编辑
        console.log('编辑')
        const payload = {
          title: this.model.title,
          property: this.model.property,
          description: this.model.description,
          groups: this.model.groups,
          fileformat: this.model.fileformat,
          endtime: this.model.endtime
        }

        console.log(payload)

        this.loadingBtn = true
        this.$q.loading.show({
          message: '保存中...'
        })
        try {
          await updateCollection(this.id, this.model)
          this.loadingBtn = false
          this.$q.loading.hide()
          this.$q.notify({
            message: '保存成功',
            color: 'positive',
            icon: 'done',
            position: 'center',
            timeout: 2000
          })
          this.fetchData()
          // this.$router.replace('/collections/myTasks')
        } catch (error) {
          this.loadingBtn = false
          this.$q.loading.hide()
          this.$q.notify({
            message: '保存失败，请稍后再试',
            color: 'red',
            icon: 'error',
            position: 'center',
            timeout: 2000
          })
        }
      }
    },
    onReset () {
      this.$q
        .dialog({
          title: '请确认',
          message: '您确定要重新填写吗？',
          ok: {
            label: '确定',
            push: true
          },
          cancel: {
            label: '取消',
            push: true,
            color: 'negative'
          },
          persistent: true
        })
        .onOk(() => {
          this.model.title = ''
          this.model.description = ''
          this.model.groups = []
          this.model.fileformat = []
          this.pickedtime = ''
          this.$q.notify({
            message: '已重置',
            color: 'positive',
            icon: 'done',
            position: 'center',
            timeout: 1000
          })
        })
        .onCancel(() => {
          this.$q.notify({
            message: '操作取消',
            color: 'warning',
            position: 'center',
            timeout: 1000
          })
        })
    }
  }
}
</script>
<style scoped>
/* .q-card {
  background-image: linear-gradient( 135deg, #FFF720 10%, #3CD500 100%);
} */
</style>
