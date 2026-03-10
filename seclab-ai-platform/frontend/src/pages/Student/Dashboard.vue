<template>
  <Layout>
    <div class="dashboard-container">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <h1 class="hero-title">开启你的安全实验之旅</h1>
        <p class="hero-description">
          在这里，你将开启一段精彩的网络安全学习之旅。我们提供专业的课程内容和实践机会，
          帮助你掌握必要的网络安全技能。
        </p>
      </div>

      <!-- 功能卡片区域 -->
      <div class="features-grid">
        <div class="feature-card" @click="$router.push('/student/courses')">
          <div class="card-icon course-icon">
            <i class="el-icon-notebook-2"></i>
          </div>
          <h3 class="card-title">课程学习</h3>
          <p class="card-description">
            探索我们精心设计的课程体系，从基础到进阶，循序渐进地学习网络安全知识。
          </p>
          <el-button type="primary" size="small" class="card-button">
            开始学习 <i class="el-icon-right"></i>
          </el-button>
        </div>

        <div class="feature-card" @click="$router.push('/student/experiments')">
          <div class="card-icon experiment-icon">
            <i class="el-icon-monitor"></i>
          </div>
          <h3 class="card-title">实践演练</h3>
          <p class="card-description">
            通过真实的案例和模拟环境，将理论知识转化为实战技能。
          </p>
          <el-button type="primary" size="small" class="card-button">
            开始实验 <i class="el-icon-right"></i>
          </el-button>
        </div>

        <div class="feature-card" @click="$router.push('/student/community')">
          <div class="card-icon community-icon">
            <i class="el-icon-chat-dot-round"></i>
          </div>
          <h3 class="card-title">学习社区</h3>
          <p class="card-description">
            加入我们的学习社区，与其他学习者交流经验，分享心得。
          </p>
          <el-button type="primary" size="small" class="card-button">
            进入社区 <i class="el-icon-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from './Layout.vue'

// 页面加载时获取数据
onMounted(() => {
  // TODO: 调用API获取用户学习数据
  // fetchDashboardData()
})

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get('/api/dashboard')
    // const data = response.data
    // 处理数据
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.course-icon {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.experiment-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.community-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.card-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }
}
</style>