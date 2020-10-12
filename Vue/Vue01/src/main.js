import Vue from 'vue'
import App from './App.vue'
import router from './www-router'
import store from './www-store'

Vue.config.productionTip = false

console.log('延迟router，让router.js更早的拿到Vue实例')
new Vue({
  // 3、添加到配置项中，为什么了？
  // 为了让router.js更早的拿到Vue实例
  router,

  store,
  render: h => h(App)
}).$mount('#app')
