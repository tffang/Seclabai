<script setup>
import Layout from './Layout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const experimentId = route.params.id
</script>

<template>
  <Layout>
    <div class="experiment-container">
      <h2>实验页面</h2>
      <p>实验ID: {{ experimentId }}</p>
      <p>实验详情内容将在这里展示...</p>
    </div>
  </Layout>
</template>

<style scoped>
.experiment-container {
  padding: 2rem;
}
</style>