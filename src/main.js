import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
// import VueGAPI from 'vue-gapi'
import App from './App.vue'

// const apiConfig = {
//   // from https://console.developers.google.com/apis/credentials
//   apiKey: 'AIzaSyCv9aoSSPDOFiXNuTMamA3lz0U19bYqYH0',
//   // from https://console.developers.google.com/apis/credentials
//   clientId: '883054884006-s4miror5q0secnkgdi8d46vji7eo7uec.apps.googleusercontent.com',
//   discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
//   // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
//   scope: 'https://www.googleapis.com/auth/spreadsheets',
//   // works only with `ux_mode: "prompt"`
//   refreshToken: false
// }

Vue.config.productionTip = false
Vue.use(BootstrapVue)
// Vue.use(VueGAPI, apiConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
