<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
        <q-card class="card-bg text-black">
          <q-card-section class="text-h6 ">
            <div class="text-h6">个人信息</div>
            <div class="text-subtitle2">完善您的个人信息</div>
          </q-card-section>
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img :src="$store.getters['user/avatar']" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="更换头像"
                    class="text-capitalize"
                    rounded
                    color="info"
                    style="max-width: 120px"
                    @click.stop="uploadAvatarDialog = !uploadAvatarDialog"
                  ></q-btn>
                </q-item-section>
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    dense
                    v-model="userDetails.username"
                    label="学号"
                    disable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    dense
                    v-model="userDetails.nickname"
                    label="姓名"
                    disable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    dense
                    v-model="userDetails.email"
                    label="邮箱"
                    disable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    dense
                    v-model="userDetails.qq"
                    label="QQ号码"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    dense
                    v-model="orgName"
                    label="组织"
                    disable
                  />
                </q-item-section>
              </q-item>
              <!-- <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    color="black"
                    type="textarea"
                    dense
                    label="个人说明"
                  />
                </q-item-section>
              </q-item> -->
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-black"
              @click="updateInfo"
              >更新个人信息</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card class="card-bg text-black">
          <q-card-section class="text-h6 q-pa-sm">
            <div class="text-h6">修改密码</div>
          </q-card-section>
          <q-card-section class="q-pa-sm row">
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                当前密码
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  color="black"
                  round
                  v-model="passwordDict.oldPassword"
                  label="Current Password"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                新密码
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  color="black"
                  round
                  v-model="passwordDict.newPassword"
                  label="New Password"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                确认新密码
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  type="password"
                  dense
                  outlined
                  round
                  color="black"
                  v-model="passwordDict.confirmPassword"
                  label="Confirm New Password"
                  :rules="[
                    val =>
                      (val && val === passwordDict.newPassword) ||
                      '两次密码不一致'
                  ]"
                />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              class="text-capitalize bg-info text-black"
              @click="changePassword"
              >确认修改</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="uploadAvatarDialog">
      <q-card class="my-card">
        <VueAvatarEditor @finished="savaAvatar" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getInfo, setInfo, changePwd } from 'src/api/user'
import { getOrgDetail } from 'src/api/query'
import { dataURItoBlob } from 'src/utils/convert-tools'
import { qiniuAvatarUpLoad } from 'src/utils/qiniu'
import VueAvatarEditor from 'vue-avatar-editor-improved'
export default {
  name: 'UserProfile',
  components: {
    VueAvatarEditor
  },
  async created () {
    const { data: user } = await getInfo()
    this.userDetails = user
    const { data: org } = await getOrgDetail(user.org)
    this.orgName = org.name
  },
  data () {
    return {
      userDetails: {},
      orgName: '',
      uploadAvatarDialog: false,
      passwordDict: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    async updateInfo () {
      await setInfo({
        nickname: this.userDetails.nickname,
        email: this.userDetails.email,
        qq: this.userDetails.qq
      })
      this.$q.notify({
        type: 'positive',
        message: '更新成功，请重新登录',
        position: 'center'
      })
      await this.$store.dispatch('user/userLogout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async changePassword () {
      try {
        await changePwd({
          oldPassword: this.passwordDict.oldPassword,
          newPassword: this.passwordDict.newPassword
        })
        this.$q.notify({
          type: 'positive',
          message: '修改密码成功，请重新登录',
          position: 'center'
        })
        await this.$store.dispatch('user/userLogout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      } catch (e) {
        console.log(e)
        this.$q.notify({
          type: 'warning',
          message: '修改密码失败',
          position: 'center'
        })
      }
    },
    async savaAvatar (img) {
      const newAvatarFile = dataURItoBlob(img.toDataURL())
      console.log(newAvatarFile)
      try {
        const res = await qiniuAvatarUpLoad(this.userDetails.username, newAvatarFile)
        console.log(res)
        await setInfo({
          avatar: `https://cltdownload.anrunlu.net/${res.data.key}`
        })
        if (res.success) {
          this.$q.notify({
            type: 'positive',
            message: '更换成功，重新登录后刷新页面生效',
            position: 'center'
          })
          await this.$store.dispatch('user/userLogout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        } else {
          this.$q.notify({
            type: 'negative',
            message: '更新失败',
            position: 'center'
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped></style>
