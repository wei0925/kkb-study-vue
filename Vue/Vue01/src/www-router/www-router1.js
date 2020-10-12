/* router.js
 * 1、 实现插件：挂载this.$router
 * 2、 实现两个组件 router-view， router-link
 */

// vue 插件： 要求必须有一个install， 将来会被Vue.use调用

/* 问题：为什么要使用 let Vue？
 * let Vue 保存Vue构造函数，插件中要使用
 * 是为了不导入Vue(`import Vue from ‘Vue’`)，还能使用Vue实例
 */
let Vue

class VueRouter {
  constructor(options) {
    this.$options = options

    // 设置current默认为/
    // this.current= "/"

    // 由于current不是响应式，如上设置（this.current= "/"）时，页面内容不会变更，但实际上，监听hash变化里是监听到了

    /* 把current作为响应式数据，将来发生变化，router-view的render函数能够再次执行
     * 方法：
     *  1. defineProperty：写法太复杂
     *  2. vue.util.defineReactive：Vue提供的定义响应式数据
     *      Vue.util为Vue工具
     *      initial：初始值
     *        缺点：只能定义一个属性
     *  3. proxy：为Vue3
     */
    const initial = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initial)

    // 监听hash变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}

// 参数1_Vue是Vue.use调用时传入的
VueRouter.install = function (_Vue) {
  // 保存传入的Vue实例
  Vue = _Vue

  /* 1、实现插件，挂载$router属性 // 56-65分钟
   * 是为了所有的组件实例都可以使用$router
   * 实现this.$router.push()等
   */

  /* 问题：为什么要使用mixin？
   * 全局混入的目的：延迟下面的逻辑到router创建完毕并且附加到选项上时才执行
   *  1. 下面逻辑指的是：“Vue.prototype.$router = this.$options.router”
   *  2. router创建完毕指的是：this.$options.router
   */
  console.log('3、初始化插件install方法：通过全局混入mixin延迟获取$router')
  Vue.mixin({
    // beforeCreate在每个组件创建实例时都会调用
    beforeCreate() {
      console.log('通过this.$options.router判断是否为根实例：', this.$options.router ? true : false)

      /* 通过this.$options.router判断是否为根实例
       *  1. 只有根实例才有该选项 this.$options.router
       *  2. this：指的是组件实例
       *  3. this.$options：相当于main.js中的new Vue({}) 选项
       */
      if (this.$options.router) {
        /* 实现组件中调用this.$router
         *  1. 将路由实例 'this.$options.router' 附加给Vue原型 'Vue.prototype'
         *  2. 每个组件实例都继承Vue， 所以每个组件都可以使用this.$router， 即 'Vue.prototype.$router'
         *  3. this.$router：指向的是this.$options.router
         */
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 2、注册实现两个组件router-view，router-link
  Vue.component('router-link', {
    // 该项目为不带编译器版本，无法直接使用template，需要使用render函数
    // template: `<a >ert</a>`,
    props: {
      to: {
        type: String,
        required: true // 要求必须设置to属性
      }
    },
    render(h) {
      /* 生成类似 <a href="to">xxx</a>
       * #：history模式比较复杂， 先使用hash模式， 为了更好的贴近单页面， 不刷新页面切换
       * this.$slots.default：使用插槽获取默认内容
       */
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }

    // 使用jsx --不推荐，兼容性差
    // render(){
    //   return <a href={'#' + this.to}>{this.$slots.default}</a>
    // }
  })

  Vue.component('router-view', {
    render(h) {
      /* 问题：如何获取当前路由所对应的组件？
       * 思路：拿到当前地址，根据用户配置的路由的映射关系，找到对应的组件
       * this：指的是router-view的组件实例
       * this.$router：指的是上面全局混入挂载的 this.$options.router
       * this.$router.$options： 当前路由选项， 在class VueRouter {}中定义
       * this.$router.current： 当前路由地址，为VueRouter的实例属性
       */
      console.log('==========================================', this)
      console.log('this.$router', this.$router)
      console.log('当前路由：', this.$router.current)

      // 获取当前路由所对应的路由对象
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      )
      console.log('当前路由对象，包含path、component等', route)

      let component = null;
      if (route) {
        component = route.component
      }

      // console.log('当前组件内容', component)

      // return h(component) 可以直接渲染处component组件的内容
      return h(component)
    }
  })
}

// 暴露插件 VueRouter
// 在index.js中会导入该插件：import VueRouter from './www-router'
export default VueRouter
