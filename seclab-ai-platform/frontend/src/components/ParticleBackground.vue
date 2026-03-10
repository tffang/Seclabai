<template>
  <canvas ref="canvasRef" class="particle-background"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let canvas = null
let ctx = null
let particles = []
let animationId = null

// 粒子配置
const config = {
  particleCount: 66,
  particleSize: 3,
  connectionDistance: 260,
  particleSpeed: 0.25,
  colors: [
    '#409eff',
    '#60a5fa',
    '#818cf8',
    '#a78bfa',
    '#fb7185'
  ]
}

// 初始化
onMounted(() => {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  // 设置canvas尺寸
  resizeCanvas()
  
  // 创建粒子
  createParticles()
  
  // 开始动画
  animate()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationId)
})

// 调整canvas尺寸
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// 创建粒子
function createParticles() {
  particles = []
  
  for (let i = 0; i < config.particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.particleSpeed,
      vy: (Math.random() - 0.5) * config.particleSpeed,
      color: config.colors[Math.floor(Math.random() * config.colors.length)]
    })
  }
}

// 绘制粒子
function drawParticles() {
  particles.forEach(particle => {
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, config.particleSize, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.fill()
  })
}

// 绘制连接线
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < config.connectionDistance) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(64, 158, 255, ${0.3 * (1 - distance / config.connectionDistance)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

// 更新粒子位置
function updateParticles() {
  particles.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    
    // 边界检测
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx = -particle.vx
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy = -particle.vy
    }
  })
}

// 动画循环
function animate() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制
  updateParticles()
  drawConnections()
  drawParticles()
  
  // 继续动画
  animationId = requestAnimationFrame(animate)
}
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: linear-gradient(to bottom, #0f172a, #1e293b);
}
</style>