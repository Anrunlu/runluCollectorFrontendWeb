<template>
  <q-page class="flex bg-image flex-center">
    <q-card
      v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
    >
      <q-card-section>
        <q-avatar size="103px" class="absolute-center shadow-10">
          <img src="~assets/org.png" />
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-pt-lg">
          <div class="col text-h6 ellipsis">
            {{ org.name }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item clickable v-ripple active>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>已注册用户数</q-item-section>
            <q-item-section side>
              <q-badge color="blue" :label="org.uNums" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple active active-class="text-green">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>所属群组数量</q-item-section>
            <q-item-section side>
              <q-badge color="green" :label="org.gNums" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple active active-class="text-red">
            <q-item-section avatar>
              <q-icon name="topic" />
            </q-item-section>
            <q-item-section>创建收集总数</q-item-section>
            <q-item-section side>
              <q-badge color="red" :label="org.cNums" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { getOrgDetail } from 'src/api/query'
export default {
  name: 'myorg',
  data () {
    return {
      org: {}
    }
  },
  methods: {
    fetchData () {
      const orgId = this.$store.getters['user/orgId']
      getOrgDetail(orgId)
        .then(res => {
          this.org = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
<style scoped>
.q-page {
  background-image: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}
.q-card {
  border-radius: 5%;
}
</style>
