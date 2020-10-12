import Vue from 'vue'

/* Vuex
 *  1. 实现this.$store
 *  2. 实现state都是响应式，this.$store.state.xxx是响应式的数据
 */
// import Vuex from 'vuex'
import Vuex from './www-store'

Vue.use(Vuex)

export default new Vuex.Store({
  // 状态、存储数据，实现响应式数据
  state: {
    counter: 0,
  },

  // 更改状态的函数
  // 对应commit方法执行mutations定义的方法
  mutations: {
    add(state){
      // state从哪里来？
      state.counter++
    }
  },

  // 异步、mutations的组合等
  // 业务逻辑，类似controller
  actions: {
    // {commit} 解构commit
    add({commit}){
      // 参数是什么，哪里来的？
      setTimeout(()=>{
        commit('add')
      }, 1000)
    }
  },

  // 类似计算属性
  getters: {
    doubleCounter(state){
      return state.counter * 2
    }
  }
})
