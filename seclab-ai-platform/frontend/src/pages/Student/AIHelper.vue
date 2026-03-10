<template>
  <Layout>
    <div class="ai-helper-container">
      <!-- AI助手头部 -->
      <div class="ai-header">
        <div class="header-left">
          <div class="ai-logo">
            <i class="el-icon-robot"></i>
            <span class="logo-text">SecLab AI</span>
            <el-tag size="small" type="info">Beta</el-tag>
          </div>
        </div>
        <div class="header-right">
          <el-button link icon="el-icon-setting" @click="showSettings"></el-button>
        </div>
      </div>

      <!-- AI助手主体内容 -->
      <div class="ai-content">
        <div class="ai-intro">
          <div class="ai-avatar">
            <i class="el-icon-shield"></i>
          </div>
          <h2 class="ai-title">SecLab AI 智能助手</h2>
          <p class="ai-description">
            您的网络安全学习伙伴，可以解答安全知识、辅助安全学习、提供实验指导
          </p>
        </div>

        <!-- 常见问题快捷按钮 -->
        <div class="quick-questions">
          <el-button type="default" size="small" v-for="(question, index) in commonQuestions" :key="index" @click="askQuestion(question)">
            {{ question }}
          </el-button>
        </div>

        <!-- 聊天记录区域 -->
        <div class="chat-history" ref="chatHistory">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message-item"
            :class="message.isUser ? 'user-message' : 'ai-message'"
          >
            <div class="message-avatar">
              <i v-if="message.isUser" class="el-icon-user"></i>
              <i v-else class="el-icon-robot"></i>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-container">
          <el-input
            v-model="inputMessage"
            placeholder="输入您的问题，例如：什么是XSS攻击？如何防范SQL注入？..."
            @keyup.enter="sendMessage"
            resize="none"
            type="textarea"
            :rows="1"
            class="chat-input"
          >
            <template #prepend>
              <i class="el-icon-edit"></i>
            </template>
          </el-input>
          <el-button type="primary" @click="sendMessage" class="send-button">
            <i class="el-icon-s-promotion"></i> 发送
          </el-button>
        </div>
        <div class="input-tips">
          Ctrl+Enter 发送
        </div>
      </div>

      <!-- 设置面板 -->
      <el-drawer
        v-model="settingsVisible"
        title="AI助手设置"
        direction="rtl"
        size="300px"
      >
        <div class="settings-content">
          <div class="setting-item">
            <span class="setting-label">AI响应速度</span>
            <el-slider v-model="settings.responseSpeed" :min="1" :max="10" :step="1"></el-slider>
          </div>
          <div class="setting-item">
            <span class="setting-label">显示打字效果</span>
            <el-switch v-model="settings.showTypingEffect"></el-switch>
          </div>
          <div class="setting-item">
            <span class="setting-label">保存聊天记录</span>
            <el-switch v-model="settings.saveChatHistory"></el-switch>
          </div>
        </div>
      </el-drawer>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Layout from './Layout.vue'

// 设置面板可见性
const settingsVisible = ref(false)

// 聊天消息
const messages = ref([])

// 输入消息
const inputMessage = ref('')

// 常见问题
const commonQuestions = [
  '什么是XSS攻击?',
  '如何防范SQL注入?',
  '什么是CSRF攻击?',
  '适合初学者的安全工具?',
  '密码学基础有哪些?',
  '如何进行安全代码审计?'
]

// AI助手设置
const settings = ref({
  responseSpeed: 5,
  showTypingEffect: true,
  saveChatHistory: true
})

// 聊天记录滚动到底部
const chatHistory = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  })
}

// 显示设置
const showSettings = () => {
  settingsVisible.value = true
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    text: inputMessage.value,
    isUser: true
  })

  // 清空输入框
  const message = inputMessage.value
  inputMessage.value = ''

  // 滚动到底部
  scrollToBottom()

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      text: `这是AI对"${message}"的回复。\n\n在实际应用中，这里会调用真实的AI服务API来获取回复内容。`,
      isUser: false
    })
    scrollToBottom()
  }, 1000)
}

// 快速提问
const askQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

// 页面加载时初始化
onMounted(() => {
  // 可以从本地存储加载聊天记录
  if (settings.value.saveChatHistory) {
    const savedMessages = localStorage.getItem('aiChatHistory')
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
      scrollToBottom()
    }
  }
})
</script>

<style scoped>
.ai-helper-container {
  min-height: 100%;
  background: var(--gradient-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

/* AI助手头部 */
.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid var(--border-color);
}

.ai-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-logo i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
}

/* AI助手内容 */
.ai-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.ai-intro {
  text-align: center;
  margin-bottom: 2rem;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0 auto 1.5rem;
}

.ai-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.ai-description {
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 常见问题 */
.quick-questions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.quick-questions .el-button {
  justify-content: flex-start;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.quick-questions .el-button:hover {
  background: rgba(64, 158, 255, 0.1);
  border-color: var(--primary-color);
  color: var(--text-primary);
}

/* 聊天记录 */
.chat-history {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  margin-bottom: 2rem;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: rgba(64, 158, 255, 0.1);
  color: var(--primary-color);
}

.ai-message .message-avatar {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.message-content {
  flex: 1;
}

.message-text {
  background: rgba(15, 23, 42, 0.6);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  line-height: 1.6;
}

/* 输入区域 */
.input-section {
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.8);
}

.input-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.chat-input {
  flex: 1;
}

.send-button {
  flex-shrink: 0;
}

.input-tips {
  text-align: right;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

/* 设置面板 */
.settings-content {
  padding: 1rem;
}

.setting-item {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-content {
    padding: 1rem;
  }

  .ai-title {
    font-size: 1.5rem;
  }

  .quick-questions {
    grid-template-columns: 1fr;
  }

  .input-section {
    padding: 1rem;
  }

  .input-container {
    flex-direction: column;
  }
}
</style>