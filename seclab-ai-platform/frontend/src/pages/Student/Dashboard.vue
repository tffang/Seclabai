<template>
  <Layout>
    <div class="dashboard-container">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <div class="sec-lab-logo">SEC LAB</div>
        <h1 class="hero-title">开启你的安全实验之旅</h1>
        <p class="hero-description">
          在这里，你将开启一段精彩的网络安全学习之旅。我们提供专业的课程内容和实战机会，
          帮助你掌握必要的网络安全技能。
        </p>
      </div>

      <!-- 功能卡片区域 -->
      <div class="features-grid">
        <div class="feature-card" @click="$router.push('/student/courses')">
          <div class="card-icon course-icon">
            <el-icon><Document /></el-icon>
          </div>
          <h3 class="card-title">课程学习</h3>
          <p class="card-description">
            探索我们精心设计的课程体系，从基础到进阶，循序渐进地学习网络安全知识。
          </p>
          <el-button type="primary" size="small" class="card-button">
            开始学习 →
          </el-button>
        </div>

        <div class="feature-card" @click="$router.push('/student/experiments')">
          <div class="card-icon experiment-icon">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <h3 class="card-title">实践演练</h3>
          <p class="card-description">
            通过真实的案例和模拟环境，将理论知识转化为实战技能。
          </p>
          <el-button type="primary" size="small" class="card-button">
            开始实验 →
          </el-button>
        </div>

        <div class="feature-card" @click="$router.push('/student/community')">
          <div class="card-icon community-icon">
            <el-icon><ChatRound /></el-icon>
          </div>
          <h3 class="card-title">学习社区</h3>
          <p class="card-description">
            加入我们的学习社区，与其他学习者交流经验，分享心得。
          </p>
          <el-button type="primary" size="small" class="card-button">
            进入社区 →
          </el-button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from './Layout.vue'
import { Document, VideoPlay, ChatRound } from '@element-plus/icons-vue'

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
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: transparent;
  overflow: hidden;
  padding: 2rem 1rem;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
}



.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.sec-lab-logo {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-weight: 300;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4facfe 0%, #e052ed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(79, 172, 254, 0.3);
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  letter-spacing: 0.02em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.feature-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(79, 172, 254, 0.2);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  cursor: pointer;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(79, 172, 254, 0.4);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.card-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin-bottom: 1.8rem;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.1) 100%);
}

.course-icon {
  color: #4facfe;
}

.experiment-icon {
  color: #00f2fe;
}

.community-icon {
  color: #4facfe;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.02em;
}

.card-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 2rem;
  letter-spacing: 0.01em;
}

.card-button {
  border-radius: 10px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  padding: 8px 24px;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .sec-lab-logo {
    font-size: 0.8rem;
  }
}
</style>