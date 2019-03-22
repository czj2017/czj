import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
// 引用routes 路由配置数组
import Routes from './routes'
import axios from 'axios'
Vue.prototype.$http= axios

// Vue.prototype.$http = aixos //全局注册 使用方法：this.$http
import './common/stylus/index.styl'

Vue.config.productionTip = false

Vue.use(VueRouter)
/**创建路由 **/
const router = new VueRouter({
  routes: Routes,
	linkActiveClass: 'active',
  mode: 'history'
})

new Vue({
  router: router,
  render: h => h(App),
  components: { App }
}).$mount('#app')
