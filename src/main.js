import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import LoadScript from 'vue-plugin-load-script'
import router from './router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(LoadScript)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
