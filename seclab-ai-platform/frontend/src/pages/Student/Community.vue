<template>
  <Layout>
    <div class="community-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">学习社区</h1>
        <p class="page-subtitle">与其他学习者交流经验，分享心得</p>
      </div>

      <!-- 社区功能区域 -->
      <div class="community-features">
        <!-- 帖子列表 -->
        <div class="posts-section">
          <div class="section-header">
            <h2 class="section-title">最新讨论</h2>
            <el-button type="primary" size="small" @click="createPost">
              <i class="el-icon-edit"></i> 发布帖子
            </el-button>
          </div>

          <!-- 帖子列表 -->
          <div class="posts-list">
            <div
              v-for="post in posts"
              :key="post.id"
              class="post-card"
              @click="viewPost(post.id)"
            >
              <div class="post-header">
                <div class="user-info">
                  <div class="user-avatar">
                    <img :src="post.author.avatar" :alt="post.author.name">
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ post.author.name }}</div>
                    <div class="post-time">{{ post.time }}</div>
                  </div>
                </div>
                <div class="post-tags">
                  <el-tag v-for="tag in post.tags" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
              </div>

              <div class="post-content">
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.excerpt }}</p>
              </div>

              <div class="post-stats">
                <div class="stat-item">
                  <i class="el-icon-view"></i> {{ post.views }}
                </div>
                <div class="stat-item">
                  <i class="el-icon-chat-dot-round"></i> {{ post.comments }}
                </div>
                <div class="stat-item">
                  <i class="el-icon-star-off"></i> {{ post.likes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 社区侧边栏 -->
        <div class="sidebar-section">
          <!-- 热门标签 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">热门标签</h3>
            <div class="hot-tags">
              <el-tag
                v-for="tag in hotTags"
                :key="tag.name"
                :type="tag.type"
                size="small"
                @click="filterByTag(tag.name)"
              >
                {{ tag.name }} <span class="tag-count">({{ tag.count }})</span>
              </el-tag>
            </div>
          </div>

          <!-- 活跃用户 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">活跃用户</h3>
            <div class="active-users">
              <div
                v-for="user in activeUsers"
                :key="user.id"
                class="active-user-item"
              >
                <div class="user-avatar-small">
                  <img :src="user.avatar" :alt="user.name">
                </div>
                <div class="user-info-small">
                  <div class="user-name-small">{{ user.name }}</div>
                  <div class="user-level-small">Lv.{{ user.level }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from './Layout.vue'

// 社区帖子数据
const posts = ref([
  {
    id: 1,
    title: '关于SQL注入的一些学习心得',
    excerpt: '最近学习了SQL注入的相关知识，想和大家分享一些自己的学习心得和经验...',
    author: {
      id: 1,
      name: '王傅雪',
      avatar: 'https://via.placeholder.com/40'
    },
    time: '2小时前',
    tags: ['SQL注入', 'Web安全'],
    views: 125,
    comments: 23,
    likes: 45
  },
  {
    id: 2,
    title: 'XSS攻击的防护策略讨论',
    excerpt: '在实际项目中遇到了XSS攻击的问题，想和大家讨论一下有效的防护策略...',
    author: {
      id: 2,
      name: '徐建国',
      avatar: 'https://via.placeholder.com/40'
    },
    time: '5小时前',
    tags: ['XSS', 'Web安全'],
    views: 98,
    comments: 15,
    likes: 32
  },
  {
    id: 3,
    title: 'IDS和IPS系统的区别与应用',
    excerpt: '在学习IDS和IPS系统时，对这两个概念有些混淆，希望能得到大家的帮助...',
    author: {
      id: 3,
      name: '林恒',
      avatar: 'https://via.placeholder.com/40'
    },
    time: '1天前',
    tags: ['IDS', 'IPS', '网络安全'],
    views: 203,
    comments: 38,
    likes: 67
  }
])

// 热门标签
const hotTags = ref([
  { name: 'Web安全', type: 'primary', count: 156 },
  { name: 'SQL注入', type: 'success', count: 89 },
  { name: 'XSS', type: 'warning', count: 76 },
  { name: '网络安全', type: 'info', count: 123 },
  { name: 'IDS/IPS', type: 'danger', count: 45 }
])

// 活跃用户
const activeUsers = ref([
  { id: 1, name: '王傅雪', avatar: 'https://via.placeholder.com/30', level: 9 },
  { id: 2, name: '徐建国', avatar: 'https://via.placeholder.com/30', level: 8 },
  { id: 3, name: '林恒', avatar: 'https://via.placeholder.com/30', level: 8 },
  { id: 4, name: '赵建国', avatar: 'https://via.placeholder.com/30', level: 7 },
  { id: 5, name: '陈曦', avatar: 'https://via.placeholder.com/30', level: 7 }
])

// 创建帖子
const createPost = () => {
  console.log('创建帖子')
  // TODO: 实现创建帖子功能
}

// 查看帖子详情
const viewPost = (postId) => {
  console.log('查看帖子详情:', postId)
  // TODO: 跳转到帖子详情页
}

// 按标签筛选
const filterByTag = (tagName) => {
  console.log('按标签筛选:', tagName)
  // TODO: 实现按标签筛选功能
}

// 页面加载时获取数据
onMounted(() => {
  fetchCommunityData()
})

// 获取社区数据
const fetchCommunityData = async () => {
  try {
    // 实际项目中这里会调用真实的API
    // const response = await axios.get('/api/community/posts')
    // posts.value = response.data
  } catch (error) {
    console.error('获取社区数据失败:', error)
  }
}
</script>

<style scoped>
.community-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* 社区功能区域 */
.community-features {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

/* 帖子列表 */
.posts-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.post-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.post-content {
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 侧边栏 */
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* 热门标签 */
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 活跃用户 */
.active-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.active-user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.active-user-item:hover {
  background: rgba(15, 23, 42, 0.8);
}

.user-avatar-small {
  width: 30px;
  height: 30px;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--border-color);
}

.user-info-small {
  flex: 1;
}

.user-name-small {
  font-weight: 600;
  color: var(--text-primary);
}

.user-level-small {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .community-features {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-stats {
    gap: 1rem;
  }
}
</style>