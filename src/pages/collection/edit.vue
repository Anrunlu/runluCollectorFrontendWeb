<template>
  <q-page class="q-pa-sm q-pt-md">
    <EditCollection :mode="mode" :id="id"></EditCollection>
  </q-page>
</template>

<script>
import EditCollection from 'components/EditCollection'
export default {
  props: ['id'],
  components: {
    EditCollection
  },
  data () {
    return {
      mode: 'edit'
    }
  }
}
</script>
<style scoped>
/* .q-card {
  background-image: linear-gradient( 135deg, #FFF720 10%, #3CD500 100%);
} */
</style>
