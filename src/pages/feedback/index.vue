<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="row justify-start">
        <div class="col">
          <q-chip
            square
            color="primary"
            size="md"
            text-color="white"
            icon="message"
          >
            新建反馈
          </q-chip>
          <q-chip outline color="teal" text-color="white" icon="bookmark">
            感谢您的支持
          </q-chip>
        </div>

        <q-btn-toggle
          v-model="feedback.type"
          push
          glossy
          toggle-color="primary"
          color="white"
          text-color="primary"
          :options="types"
        />
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md row justify-center">
          <q-input
            filled
            v-model="feedback.title"
            label="标题"
            class="col-12"
            :rules="[val => !!val || '请输入标题']"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>
          <q-input
            v-model="feedback.description"
            filled
            clearable
            class="col-12"
            type="textarea"
            color="red-12"
            label="详细描述..."
          />

          <div class="col-12 row justify-start">
            <q-checkbox
              keep-color
              v-model="feedback.needreply"
              label="希望收到开发人员回复"
              color="orange"
            />
            <q-btn
              class="q-ml-md"
              label="提交反馈"
              type="submit"
              color="primary"
              :loading="loadingBtn"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { createFeedback } from 'src/api/feedback'
export default {
  data () {
    return {
      loadingBtn: false,
      types: [
        {
          label: 'BUG反馈',
          value: 'bug'
        },
        {
          label: '功能建议',
          value: 'feature'
        }
      ],
      feedback: {
        title: '',
        type: 'bug',
        needreply: false,
        creator: this.$store.getters['user/id'],
        description: ''
      }
    }
  },

  methods: {
    async onSubmit () {
      this.loadingBtn = true
      await createFeedback(this.feedback)
      this.loadingBtn = false
      this.$q.dialog({
        title: '反馈提交成功',
        message: '反馈提交成功，即将跳转到首页...',
        position: 'bottom',
        persistent: true
      })
      setTimeout(() => {
        this.$router.replace('/')
      }, 3000)
    }
  }
}
</script>
