<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
          class="q-mt-xl"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="~assets/profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                注册
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-sm">
              <q-select
                dense
                v-model="model.org"
                :options="orgOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                label="组织 *"
                icon
                hint="填写组织"
                :rules="[val => !!val || '请输入组织']"
              >
                <template v-slot:prepend>
                  <q-icon name="school" color="blue" />
                </template>
              </q-select>

              <q-input
                v-model="model.username"
                label="学工号 *"
                hint="填写您的学号/工号"
                :rules="[checkUsername]"
              >
                <template v-slot:prepend>
                  <q-icon name="perm_identity" color="blue" />
                </template>
              </q-input>

              <q-input
                v-model="model.nickname"
                label="姓名 *"
                hint="填写您的姓名"
                :rules="[val => (val && val.length >= 2) || '请输入您的姓名']"
              >
                <template v-slot:prepend>
                  <q-icon name="fingerprint" color="blue" />
                </template>
              </q-input>

              <q-input
                type="email"
                v-model="model.email"
                label="邮箱 *"
                hint="邮箱将作为用户名登录"
                :rules="[val => !!val || '请输入正确的电子邮件地址']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="blue" />
                </template>
              </q-input>

              <q-input
                v-model="model.qq"
                label="QQ *"
                hint="QQ用于接收通知"
                :rules="[val => !!val || '请输入您的QQ']"
              >
                <template v-slot:prepend>
                  <q-icon name="sms" color="blue" />
                </template>
              </q-input>

              <q-input
                v-model="model.password"
                label="密码 *"
                :type="isPwd ? 'password' : 'text'"
                hint="设置用户密码"
                :rules="[
                  val => (val && val.length >= 6) || '密码至少为6个字符'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="blue" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row q-mt-lg">
                <q-btn
                  class="col-6"
                  label="注册"
                  type="submit"
                  color="primary"
                  icon-right="people"
                  push
                  :disable="disableRegisterBtn"
                  :loading="btnLoading"
                  @submit="onSubmit"
                />
                <q-btn
                  label="已有账号？去登陆"
                  color="primary"
                  flat
                  class="q-ml-sm"
                  to="/login"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { register } from '../../api/user'
import { getOrgList, isUsernameExist } from '../../api/query'
export default {
  // name: 'PageName',
  data () {
    return {
      model: {},
      isPwd: true,
      btnLoading: false,
      orgOptions: [],
      disableRegisterBtn: true
    }
  },
  created () {
    getOrgList().then(res => {
      console.log(res.data)
      this.orgOptions = res.data
    })
  },
  methods: {
    onSubmit () {
      this.btnLoading = true
      register(this.model)
        .then(res => {
          const createdUser = res.data
          if (createdUser && createdUser._id !== '') {
            this.$q.notify({
              message: '注册成功',
              color: 'green',
              icon: 'done',
              position: 'center'
            })
            this.$router.push('/login')
          } else {
            this.$q.notify({
              message: '注册失败',
              color: 'red',
              icon: 'error',
              position: 'center'
            })
          }
          this.btnLoading = false
        })
        .catch(err => {
          console.log(err)
          this.btnLoading = false
        })
    },
    checkUsername (val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          isUsernameExist(this.model.org, val).then(res => {
            if (!val) {
              resolve('学/工号不可为空')
            }
            if (!res.data.exist) {
              this.disableRegisterBtn = false
              resolve(true)
            } else {
              this.disableRegisterBtn = true
              resolve('该学/工号已注册')
            }
          })
        }, 1000)
      })
    }
  }
}
</script>
<style scoped>
.bg-image {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}
</style>
