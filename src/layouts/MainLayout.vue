<template>
  <q-layout view="hHh Lpr lff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <img src="~assets/logo.png" width="120" />
          <span class="q-ml-sm"
            ><q-btn color="gray" flat label="工作台" to="/"
          /></span>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="GPL__toolbar-input"
          dense
          standout="bg-primary"
          v-model="search"
          placeholder="Search"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

        <q-btn
          v-if="$q.screen.gt.xs"
          flat
          dense
          no-wrap
          color="primary"
          icon="add"
          label="新建"
          class="q-ml-sm q-px-md"
        >
          <q-menu anchor="bottom right" self="top right">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item
                v-for="menu in createMenu"
                :key="menu.text"
                :to="menu.to"
                clickable
                v-close-popup
                aria-hidden="true"
              >
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.text }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="$q.screen.gt.xs"
          flat
          dense
          no-wrap
          color="primary"
          icon="topic"
          label="任务列表"
          class="q-ml-sm q-px-md"
          to='/collections/myTasks'
        />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="text-grey-7" icon="apps" to="/">
            <q-tooltip>工作台</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications" to="/notice">
            <!-- <q-badge color="red" text-color="white" floating>
              2
            </q-badge> -->
            <q-tooltip>消息通知</q-tooltip>
          </q-btn>

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="25px">
              <img :src="$store.getters['user/avatar']" />
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GPL__menu-link-signed-in">
                  <q-item-section>
                    <div>
                      <strong>{{ $store.getters["user/nickname"] }}</strong>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <!-- <q-item clickable class="GPL__menu-link">
                  <q-item-section>帮助</q-item-section>
                </q-item> -->
                <q-item clickable class="GPL__menu-link">
                  <q-item-section @click="$router.push('/me/settings')"
                    >个人设置</q-item-section
                  >
                </q-item>
                <q-item clickable class="GPL__menu-link">
                  <q-item-section @click="logout">退出登录</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!leftDrawerOpen || miniState"
      elevated
      :width="250"
      :breakpoint="500"
      @click.capture="drawerClick"
      side="left"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar mobile-only">
          <q-toolbar-title class="row items-center text-grey-8">
            <img class="q-pl-md" src="~assets/logo.png" width="140" />
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.text"
            :to="link.to"
            clickable
            exact
            v-ripple.early
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links2"
            :key="link.text"
            :to="link.to"
            clickable
            exact
            v-ripple.early
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links3"
            :key="link.text"
            :to="link.to"
            clickable
            exact
            v-ripple.early
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title class="text-center text-caption">
          &copy; 2020 · 润鲁收集 · POWERED BY 安润鲁
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container class="GPL__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      miniState: false,
      leftDrawerOpen: true,
      search: '',
      links1: [
        { icon: 'topic', text: '任务列表', to: '/collections/myTasks' },
        {
          icon: 'create_new_folder',
          text: '创建收集',
          to: '/collections/create'
        }
      ],
      links2: [
        { icon: 'insert_drive_file', text: '我的文件', to: '/me/posts' },
        { icon: 'folder', text: '我的收集', to: '/me/collections' },
        { icon: 'people', text: '我的群组', to: '/me/groups' },
        { icon: 'school', text: '我的组织', to: '/me/org' }
      ],
      links3: [
        { icon: 'notifications', text: '消息中心', to: '/notice' },
        { icon: 'settings', text: '个人设置', to: '/me/settings' },
        { icon: 'help', text: '帮助与反馈', to: '/feedback' }
        // { icon: 'get_app', text: '客户端下载', to: '/' }
      ],
      createMenu: [
        { icon: 'create_new_folder', text: '收集', to: '/collections/create' },
        { icon: 'group_add', text: '群组' }
      ]
    }
  },
  created () {
    if (this.$q.platform.is.mobile) {
      this.leftDrawerOpen = false
    }
  },
  methods: {
    async logout () {
      await this.$store.dispatch('user/userLogout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    drawerClick (e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation()
      }
    }
  }
}
</script>

<style lang="sass">
.q-router-link--active
  background-color:#e4eceb
.GPL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__menu-link:hover
    background: #0366d6
    color: white
  &__menu-link-signed-in
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
</style>
