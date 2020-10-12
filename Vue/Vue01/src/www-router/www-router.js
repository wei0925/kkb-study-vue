let Vue

class VueRouter {
  constructor(options) {
    this.$options = options

    const initial = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initial)

    Vue.util.defineReactive(this, 'matched', [])
    // match方法可以递归遍历路由表，获得匹配关系数组
    this.match()

    // 监听hash变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))

    // 创建一个路由映射表
    this.routeMap = {}
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route
    })
  }

  onHashChange () {
    this.current = window.location.hash.slice(1)
    this.matched = []
    this.match()
  }


  match (routes) {
    routes = routes || this.$options.routes

    // 遍历递归
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }

      // 假设当前路由为 /about/info
      if (route.path !== '/' && this.current.indexOf(route.path) != -1) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
        return
      }
    }
  }
}

// 参数1_Vue是Vue.use调用时传入的
VueRouter.install = function (_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 2、注册实现两个组件router-view，router-link
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true // 要求必须设置to属性
      }
    },
    render(h) {
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }
  })

  Vue.component('router-view', {
    render(h) {
      // 实现路由嵌套

      // 标记当前router-view深度
      this.$vnode.data.routerView = true

      let depth = 0

      let parent = this.$parent

      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data

        if (vnodeData) {
          if (vnodeData.routerView) {
            // 说明当前parent是一个routerView
            depth++
          }
        }

        parent = parent.$parent
      }
      console.log('parent', parent)

      // 获取当前路由所对应的路由对象
      let component = null;
      const route = this.$router.matched[depth]
      if(route){
        component = route.component
      }
      return h(component)

      // const route = this.$router.$options.routes.find(
      //   (route) => route.path === this.$router.current
      // )

      // let component = null;
      // if (route) {
      //   component = route.component
      // }

      // return h(component)
    }
  })
}

// 暴露插件 VueRouter
// 在index.js中会导入该插件：import VueRouter from './www-router'
export default VueRouter