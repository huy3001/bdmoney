import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import VueGAPI from 'vue-gapi'
import App from './App.vue'

const apiConfig = {
  // from https://console.developers.google.com/apis/credentials
  apiKey: '',
  // from https://console.developers.google.com/apis/credentials
  clientId: '',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  // works only with `ux_mode: "prompt"`
  refreshToken: true
}

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueGAPI, apiConfig)

new Vue({
  render: h => h(App),
}).$mount('#app')
