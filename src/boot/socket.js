// import VueSocketIO from 'vue-socket.io'
// // "async" is optional;
// // more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// export default async ({ app, router, Vue }) => {
//   Vue.use(new VueSocketIO({
//     debug: true,
//     connection: process.env.SOCKET
//   }))
// }
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
  debug: false,
  connection: process.env.SOCKET
}))
