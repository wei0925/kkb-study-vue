/* store.js
 * 1、 插件： 挂载$store
 * 2、 实现store
 */

/* Vuex
 * 工程化上来说：响应式不太适合管理数据，还是需要使用Vuex
 * Vuex集中式存储管理应用的所有组件的状态，所以相应的规则保证状态已可预测的方式发生变化
 */

let Vue

class Store{
  // 真正源码中不会如此写，会隐藏下state
  // 让用户不直接接触Vue实例，这样写如果用户强行变更值，值就会真的改变
  // constructor(options){
  //   /* 问题：state如何进行响应式处理？
  //    * 快速定义响应式数据：在router.js中使用vue.util.defineReactive， 但是这个有缺点，只能定义一个属性
  //    * 在此state可能很复杂，可能会有组件的嵌套等
  //    * 如何实现 - 借鸡生蛋： 通过借用new Vue() 的date来实现
  //    */ 

  //   /* 问题：new Vue()时，为什么数据要放在date中？
  //    * 因为Vue默认情况下会对date的所有属性进行递归遍历，变成响应式数据
  //    */

  //   /* 问题：如何实现外部通过 this.$store.state.xx调用？
  //    * 将 new Vue()赋值给 this.state
  //    */
  //   this.state = new Vue({
  //     data: options.state
  //   })

  //   // 保存mutations，以便commit中使用
  //   this._mutations = options.mutations
  // }

  // 隐藏Vue实例写法
  constructor(options){
    // 通过$$state做响应式处理
    // _xx为内部变量，不希望用户能够修改
    this._vm = new Vue({
      data: {
        $$state: options.state
      }
    })

    // 保存mutations，以便commit中使用
    this._mutations = options.mutations

    this._actions = options.actions

    // 解决 dispatch(){}中 this 指向问题
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    // 实现getters
    this._getters = options.getters || {}

    const store = this
    store.getters = this._getters

    // 遍历数据
    Object.keys(this.getters).forEach((key) => {
      store._vm[key] = this.getters[key](store.state)
      
      Object.defineProperty(this.getters, key, {
        get() {
          return store._vm[key]
        }
      })
    })
  }

  // 暴露state给外界
  // 可以get到，但不能set到
  get state() {
    /* 问题：为什么必须使用以下方式访问$$state
     * 因为$$state通过两个$就不会被代理，通过this._vm.$$state是拿不到的，$$state会隐藏起来
     */
    console.log('this._vm', this._vm)

    /* _data 的区别 $data
     * 隐式区分：_data内部使用，$data是暴露给你看的，谨慎起见使用_data
     */
    return this._vm._data.$$state

    // 与上面写法一样
    // return this._vm.$data.$$state
  }

  set state(v) {
    // 提示：请使用replaceState重置状态
    console.error('please use replaceState to reset state')
  }

  /* commit
   * 思路： 通过type在mutations里找到对应的方法并执行， 并且传入state
   * type： 用户将来提交时， 会指定一个名字type， type为mutations定义的方法名
   * payload： 有可能传入的参数
   */ 
  commit(type, payload){
    // 找到对应的方法
    const entry = this._mutations[type]
    
    // 没有对应的方法报错
    if(!entry){
      console.log('unknown mutation type')
    }

    // 执行对应的方法并传入state
    entry(this.state, payload)
  }

  dispatch(type, payload){
    const entry = this._actions[type]

    if (!entry) {
      console.log('unknown action type')
    }

    entry(this, payload)
  }
}


function install(_Vue){
  Vue = _Vue

  Vue.mixin({
    beforeCreate(){
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

/* 为了实现index.js
 *  1. import Vuex from 'vuex' ：得到的是 Vuex: {Store, install}
 *  2. Vue.use(Vuex) ：调用的就是install方法
 *  3. Vuex.Store ：获取的是 Store 类
 */
export default { Store, install }