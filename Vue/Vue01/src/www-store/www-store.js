let Vue

class Store{
  constructor(options){
    this._mutations = options.mutations
    this._actions = options.actions

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)

    // 实现getters
    this._wrappedGetters = options.getters

    // 定义computed选项
    const computed = {}
    // 暴露getters
    this.getters = {}

    const store = this
    Object.keys(this._wrappedGetters).forEach( (key) =>{
      // 获取用户定义的getter
      const fn = store._wrappedGetters[key]

      // 转换为computed可以使用无参数形式
      computed[key] = function () {
        return fn(store.state)
      }

      // 为getters定义只读属性      
      Object.defineProperty(store.getters, key, {
        get: ()=>{
          console.log('===================', store.getters, store, store._vm)
          return store._vm[key]
        }
      })
    })

    this._vm = new Vue({
      data: {
        $$state: options.state
      },

      // 挂载computed
      computed
    })
  }
  
  get state() {
    console.log('this._vm', this._vm)

    return this._vm._data.$$state
  }

  set state(v) {
    console.error('please use replaceState to reset state')
  }

  commit(type, payload){
    const entry = this._mutations[type]
    
    if(!entry){
      console.log('unknown mutation type')
    }

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

export default { Store, install }