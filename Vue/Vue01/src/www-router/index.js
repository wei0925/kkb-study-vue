import Vue from 'vue'

/* 1、VueRouter是一个插件？
 * 内部做了什么？
 *  1. 实现两个组件 router - view, router - link
 *  2. install：实现this.$router
 */
// import VueRouter from 'vue-router'
console.log(`1、引入router.js插件：import VueRouter from './www-router'`)
import VueRouter from './www-router'

console.log('2、通过use方法调用router.js中的install方法：Vue.use(VueRouter)')
Vue.use(VueRouter)


import Home from '../components/Home.vue'

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../components/About.vue'),
    children: [{
      path: '/about/info',
      component: {
        render(h) {
          return h('div', 'info page')
        }
      }
    }]
  }
]

// 2、创建实例
const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router