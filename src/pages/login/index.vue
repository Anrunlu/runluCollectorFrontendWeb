<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="~assets/profile1.png" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                登录
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="handleLogin" class="q-gutter-md">
              <q-input
                filled
                type="email"
                v-model="model.email"
                label="用户名"
                hint="用户名为邮箱账号"
                :rules="[val => !!val || '请输入正确的用户名']"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" color="black" />
                </template>
              </q-input>

              <q-input
                filled
                v-model="model.password"
                label="密码"
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="black" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row">
                <q-btn
                  class="col-xs-5 col-md-4"
                  label="登录"
                  type="submit"
                  color="black"
                  icon-right="send"
                  push
                  :loading="btnLoading"
                />
                <q-btn
                  label="没有账号? 点击注册"
                  color="primary"
                  flat
                  class="q-ml-sm"
                  to="/register"
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
export default {
  // name: 'PageName',
  data () {
    return {
      model: {
        email: 'test@test.com',
        password: '123456'
      },
      isPwd: true,
      btnLoading: false
    }
  },
  methods: {
    handleLogin () {
      this.btnLoading = true
      this.$store
        .dispatch('user/userLogin', this.model)
        .then(() => {
          this.$q.notify({
            message: '登录成功',
            color: 'positive',
            icon: 'done',
            position: 'center'
          })
          // 跳转到之前的页面或者首页
          this.$router.push(this.$route.query.redirect || '/').catch(e => {})
          this.btnLoading = false
        })
        .catch(e => {
          console.log(e)
          this.$q.notify({
            message: '登录失败',
            color: 'negative',
            icon: 'error',
            position: 'center'
          })
          this.btnLoading = false
        })
    }
  }
}
</script>
<style scoped>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
