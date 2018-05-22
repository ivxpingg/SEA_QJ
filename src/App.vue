<template>
  <div ref="app" class="app-container">

    <router-view></router-view>
  </div>

</template>

<script>
export default {
    name: 'app',
    components: {
    },
    created(){
        // console.log('created');
    },
    mounted() {


    }
}
</script>

<style scoped>
  .app-container {
    height: 100%;
    overflow: hidden;
  }
</style>
