<template>
  <q-page class="q-pa-sm q-pt-md">
    <EditCollection :mode="mode"></EditCollection>
  </q-page>
</template>

<script>
import EditCollection from 'components/EditCollection'
export default {
  components: {
    EditCollection
  },
  data () {
    return {
      mode: 'create'
    }
  }
}
</script>
<style scoped>
/* .q-card {
  background-image: linear-gradient( 135deg, #FFF720 10%, #3CD500 100%);
} */
</style>
