<script setup>
// 导入路由视图
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <!-- 全局星空背景 -->
    <div class="stars"></div>
    <!-- 路由视图容器 -->
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;
}

/* 全局星空背景 */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
  background-image: 
    radial-gradient(1px 1px at 25px 5px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 25px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 125px 20px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 50px 75px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 15px 125px, #fff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 110px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 175px 125px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 200px 50px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 225px 100px, #fff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 50px 50px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 150px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 75px 175px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 25px 200px, #fff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 100px 25px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 175px 225px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 225px 250px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 300px, #fff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 125px 325px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 175px 350px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 25px 375px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 100px 400px, #fff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 150px 425px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 200px 450px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 225px 475px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 500px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 500px 500px;
  opacity: 1;
  z-index: -1;
  animation: twinkle 8s infinite alternate;
}

@keyframes twinkle {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
</style>
