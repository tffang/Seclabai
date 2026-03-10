<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import ParticleBackground from '../../components/ParticleBackground.vue'

const router = useRouter()

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}

// 数据统计
const stats = [
  { value: '12个', label: '核心课程' },
  { value: '10w字', label: '实验教学手册' },
  { value: '17种', label: '漏洞类型' }
]
</script>

<template>
  <div class="welcome-container">
    <!-- 粒子背景 -->
    <ParticleBackground />
    
    <!-- 顶部导航 -->
    <nav class="welcome-nav">
      <div class="nav-left">
        <div class="logo-container">
          <img src="/images/logo3.svg" alt="SecLab AI Logo" class="logo-image">
          <h1 class="logo">SecLab AI</h1>
        </div>
      </div>
      <div class="nav-right">
        <el-button type="text" size="large" class="nav-button" @click="goToLogin">
          登录
        </el-button>
        <el-button type="primary" size="large" class="nav-button primary-button" @click="goToRegister">
          注册
        </el-button>
      </div>
    </nav>
    
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h2 class="hero-title">
          SecLab AI
        </h2>
        <p class="hero-subtitle">让网安学习变简单</p>
        <p class="hero-description">
          AI定制专属学习路径，你也能成为下一个网络安全专家
        </p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" class="primary-button" @click="goToLogin">
            开始免费体验
          </el-button>
          <el-button type="default" size="large" class="secondary-button" @click="goToRegister">
            了解更多
          </el-button>
        </div>
        
        <!-- 数据统计 -->
        <div class="stats-container">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <div class="stat-value"><span class="stat-value-number">{{ stat.value }}</span></div>
            <div class="stat-label">
              <span>{{ stat.label }}</span>
            </div>
            <div class="stat-divider" v-if="index < stats.length - 1"></div>
          </div>
        </div>
      </div>
      
      <div class="hero-image">
        <!-- 可视化图标区域 -->
        <div class="visual-icons">
          <div class="icon-item icon-shield">
            <i class="el-icon-shield"></i>
          </div>
          <div class="icon-item icon-lock">
            <i class="el-icon-lock"></i>
          </div>
          <div class="icon-item icon-key">
            <i class="el-icon-key"></i>
          </div>
          <div class="icon-item icon-reading">
            <i class="el-icon-reading"></i>
          </div>
          <div class="icon-item icon-computer">
            <i class="el-icon-computer"></i>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 专业课程体系 -->
    <section class="courses-section">
      <h3 class="section-title">专业课程体系</h3>
      
      <div class="courses-grid">
        <div class="course-card">
          <div class="course-icon">
            <i class="el-icon-shield"></i>
          </div>
          <h4 class="course-title">实战演练</h4>
          <p class="course-description">
            系统化学习渗透测试技术，掌握白帽黑客攻击思维
          </p>
          <ul class="course-features">
            <li class="feature-item">Web漏洞挖掘与利用</li>
            <li class="feature-item">AD域渗透与横向移动</li>
            <li class="feature-item">云原生安全</li>
            <li class="feature-item">容器安全</li>
            <li class="feature-item">AI安全</li>
          </ul>
          <el-button type="text" class="course-button">查看详情 →</el-button>
        </div>
        
        <div class="course-card highlighted">
          <div class="course-icon">
            <i class="el-icon-lock"></i>
          </div>
          <h4 class="course-title">安全防护</h4>
          <p class="course-description">
            深入学习应急响应、漏洞修复、系统加固
          </p>
          <ul class="course-features">
            <li class="feature-item">安全架构设计</li>
            <li class="feature-item">应急响应实战</li>
            <li class="feature-item">安全运营与监控</li>
            <li class="feature-item">漏洞分析与修复</li>
          </ul>
          <el-button type="text" class="course-button">查看详情 →</el-button>
        </div>
        
        <div class="course-card">
          <div class="course-icon">
            <i class="el-icon-code"></i>
          </div>
          <h4 class="course-title">全栈进阶</h4>
          <p class="course-description">
            攻防兼备，进阶网络安全核心竞争力人才
          </p>
          <ul class="course-features">
            <li class="feature-item">代码审计技术</li>
            <li class="feature-item">安全开发实践</li>
            <li class="feature-item">逆向分析技术</li>
            <li class="feature-item">安全工具开发</li>
          </ul>
          <el-button type="text" class="course-button">查看详情 →</el-button>
        </div>
      </div>
    </section>
    
    <!-- 平台优势 -->
    <section class="advantages-section">
      <h3 class="section-title">为什么选择 SecLab AI?</h3>
      
      <div class="advantages-grid">
        <div class="advantage-card">
          <div class="advantage-icon">
            <i class="el-icon-server"></i>
          </div>
          <h4 class="advantage-title">实战环境</h4>
          <p class="advantage-description">
            企业级红对蓝的环境，学员直面企业实际安全威胁，涵盖代码安全、应用安全、Web安全、软件供应链安全、AD域渗透、云原生安全、容器安全、AI安全等多个企业安全风险攻防实训，每项操作与真实工作无缝衔接，高效提升攻防能力
          </p>
        </div>
        
        <div class="advantage-card">
          <div class="advantage-icon">
            <i class="el-icon-user-group"></i>
          </div>
          <h4 class="advantage-title">社区交流</h4>
          <p class="advantage-description">
            活跃的学习社区，定期分享实战案例，专家在线答疑，优质直播深入浅出
          </p>
        </div>
        
        <div class="advantage-card highlighted">
          <div class="advantage-icon">
            <i class="el-icon-chat-dot-round"></i>
          </div>
          <h4 class="advantage-title">AI智能教学</h4>
          <p class="advantage-description">
            基于AI的智能教学系统，提供个性化学习路径规划、智能漏洞分析辅助、实时解题指导和自适应学习反馈，让学习更高效、更智能
          </p>
        </div>
      </div>
    </section>
    
    <!-- 行动召唤区域 -->
    <section class="cta-section">
      <h3 class="cta-title">想要成为网络安全大牛?</h3>
      <p class="cta-description">加入SecLab AI，用技术守护网络空间安全</p>
      <el-button type="primary" size="large" class="primary-button" @click="goToRegister">
        立即体验
      </el-button>
    </section>
    
    <!-- 底部信息 -->
    <footer class="welcome-footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo-container">
          <img src="/images/logo3.svg" alt="SecLab AI Logo" class="logo-image footer-logo-image">
          <h3 class="footer-logo">SecLab AI</h3>
        </div>
          <p class="footer-description">
            网络安全实验平台 © 2026
          </p>
        </div>
        <div class="footer-links">
          <el-link type="text" class="footer-link">关于我们</el-link>
          <el-link type="text" class="footer-link">联系我们</el-link>
          <el-link type="text" class="footer-link">隐私政策</el-link>
          <el-link type="text" class="footer-link">服务条款</el-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-color: #409eff;
  --primary-dark: #2563eb;
  --secondary-color: #60a5fa;
  --background-dark: #0f172a;
  --card-background: #1e293b;
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.87);
  --text-tertiary: rgba(255, 255, 255, 0.6);
  --border-color: rgba(255, 255, 255, 0.1);
  --grid-color: rgba(64, 158, 255, 0.1);
}

.welcome-container {
  min-height: 100vh;
  background-color: transparent;
  color: var(--text-primary);
  position: relative;
  overflow: visible;
}

/* 背景效果 */
.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, rgba(64, 158, 255, 0.3) 1px, transparent 1px),
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 200px 200px, 50px 50px, 50px 50px;
  background-position: center, 0 0, 0 0;
  z-index: 0;
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, var(--primary-color) 1px, transparent 1px),
    radial-gradient(circle, var(--primary-color) 1px, transparent 1px),
    radial-gradient(circle, var(--primary-color) 1px, transparent 1px),
    linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, transparent 50%);
  background-size: 100px 100px, 150px 150px, 200px 200px, cover;
  background-position: 0 0, 25px 25px, 50px 50px, center;
  animation: floatingPoints 25s ease-in-out infinite alternate;
  z-index: 0;
}

@keyframes floatingPoints {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.02);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.98);
  }
  75% {
    transform: translate(15px, 5px) scale(1.03);
  }
  100% {
    transform: translate(-5px, -15px) scale(0.97);
  }
}

/* 顶部导航 */
.welcome-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.footer-logo-image {
  width: 32px;
  height: 32px;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.cloud-badge {
  font-size: 0.8rem;
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: rgba(64, 158, 255, 0.1);
}

.nav-right {
  display: flex;
  gap: 1rem;
}

.nav-button {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--background-dark);
  font-weight: 600;
  
  &:hover {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
    color: var(--background-dark);
  }
}

/* 英雄区域 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 3rem;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  text-align: center;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--primary-color), var(--text-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.secondary-button {
  background-color: transparent;
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
  
  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

/* 数据统计 */
.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.6);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 240px;
  max-width: 300px;
  text-align: center;
  height: 240px;
  
  &:hover {
    transform: translateY(-8px);
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 15px 40px rgba(64, 158, 255, 0.25);
  }
}

.stat-value {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 0 30px rgba(64, 158, 255, 0.6);
  animation: pulse 2s ease-in-out infinite;
  font-family: 'Monaco', 'Courier New', monospace;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  line-height: 1.4;
}

.stat-divider {
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, transparent, rgba(64, 158, 255, 0.3), transparent);
  display: none;
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-item {
    width: 100%;
    max-width: 300px;
  }
}

/* 专业课程体系 */
.courses-section {
  padding: 6rem 3rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: var(--text-primary);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.course-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2.5rem 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 30px rgba(64, 158, 255, 0.1);
  }
}

.course-card.highlighted {
  border-color: var(--primary-color);
  box-shadow: 0 0 30px rgba(64, 158, 255, 0.15);
}

.course-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
}

.course-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  text-align: center;
}

.course-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
}

.course-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.feature-item {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
  }
}

.course-button {
  color: var(--primary-color);
  font-weight: 600;
  padding: 0;
  margin-top: 1rem;
  display: block;
  text-align: center;
  
  &:hover {
    color: var(--primary-dark);
  }
}

/* 平台优势 */
.advantages-section {
  padding: 6rem 3rem;
  position: relative;
  z-index: 1;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.advantage-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 30px rgba(64, 158, 255, 0.1);
  }
}

.advantage-card.highlighted {
  border-color: var(--primary-color);
  box-shadow: 0 0 30px rgba(64, 158, 255, 0.2);
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, var(--card-background) 100%);
}

.advantage-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.advantage-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.advantage-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 行动召唤区域 */
.cta-section {
  padding: 6rem 3rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.cta-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

/* 底部信息 */
.welcome-footer {
  padding: 3rem;
  border-top: 1px solid var(--border-color);
  background: rgba(10, 14, 23, 0.8);
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.footer-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .courses-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .advantages-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .welcome-nav {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 1.5rem;
  }
  
  .nav-left {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
  
  .courses-section,
  .advantages-section,
  .cta-section {
    padding: 4rem 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>