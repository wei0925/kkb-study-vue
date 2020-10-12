<template>
  <div id="app">
    <!-- 5、路由跳转链接 -->
    <router-link to="/">Home</router-link>
    ｜
    <router-link to="/about">About</router-link>

    <!-- 4、路由出口 -->
    <!-- 利用Vue响应式：current当前地址 -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
