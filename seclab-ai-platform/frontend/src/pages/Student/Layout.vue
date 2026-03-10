<template>
  <div class="student-layout">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <div class="nav-left">
        <h1 class="logo">Sec Lab</h1>
      </div>
      <div class="nav-center">
        <el-menu
          :default-active="activeNav"
          class="nav-menu"
          mode="horizontal"
          background-color="transparent"
          text-color="#a1a1aa"
          active-text-color="#409eff"
          :router="true"
          :ellipsis="false"
        >
          <el-menu-item index="/student/dashboard">
            <template #title>
              <span class="menu-text">首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/student/courses">
            <template #title>
              <span class="menu-text">课程</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/student/experiments">
            <template #title>
              <span class="menu-text">实验</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/student/community">
            <template #title>
              <span class="menu-text">社区</span>
            </template>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="nav-right">
        <el-button link icon="el-icon-user" @click="$router.push('/student/profile')">
          个人中心
        </el-button>
        <el-button link icon="el-icon-robot" @click="$router.push('/student/ai-helper')">
          AI助手
        </el-button>
        <el-button link icon="el-icon-switch-button" @click="logout">
          退出登录
        </el-button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- AI助手悬浮按钮 -->
    <div class="ai-float-btn" @click="$router.push('/student/ai-helper')">
      <i class="el-icon-robot"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 计算当前激活的导航项
const activeNav = computed(() => {
  return route.path
})

// 退出登录功能
const logout = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  
  // 显示退出成功消息
  ElMessage.success('退出登录成功')
  
  // 跳转到登录页面
  router.push('/login')
}

// AI助手功能已移至独立页面
</script>

<style scoped>
.student-layout {
  min-height: 100vh;
  background: transparent;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-menu {
  border-bottom: none;
}

.menu-text {
  font-size: 0.95rem;
}

.nav-right {
  display: flex;
  gap: 1rem;
}

.nav-right .el-button {
  font-size: 0.9rem;
  border: none;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.ai-float-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.ai-float-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 0.8rem 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .nav-center {
    display: flex;
    width: 100%;
    order: 3;
  }

  .menu-text {
    font-size: 0.85rem;
  }

  .nav-right .el-button {
    font-size: 0.8rem;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    padding: 0;
  }

  .menu-text {
    font-size: 0.8rem;
  }
  
  .el-menu-item {
    padding: 0 8px !important;
  }
}
</style>