<script setup>
// 导入路由视图
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <!-- 路由视图容器 -->
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>
