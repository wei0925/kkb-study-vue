<template>
  <div>
    <p @click="$store.commit('add')">counter：{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">async counter：{{$store.state.counter}}</p>
    <p>doubleCounter: {{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
  export default {
    data(){
      return {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>