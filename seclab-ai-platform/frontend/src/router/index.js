import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

// 导入需要直接使用的组件
import StudentProfile from '../pages/Student/Profile.vue'
import StudentExperiment from '../pages/Student/Experiment.vue'

// 路由配置
const routes = [
  // 欢迎页
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../pages/Welcome/Welcome.vue'),
    meta: { requiresAuth: false, title: '欢迎来到网络安全实验平台' }
  },
  
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Access/Login.vue'),
    meta: { requiresAuth: false, title: '登录 - 网络安全实验平台' }
  },
  
  // 注册页
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Access/Register.vue'),
    meta: { requiresAuth: false, title: '注册 - 网络安全实验平台' }
  },
  
  // 学生端路由
  {
    path: '/student',
    name: 'Student',
    redirect: '/student/dashboard',
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: () => import('../pages/Student/Dashboard.vue'),
        meta: { title: '学生首页 - 网络安全实验平台' }
      },
      {
        path: 'courses',
        name: 'StudentCourses',
        component: () => import('../pages/Student/CourseList.vue'),
        meta: { title: '我的课程 - 网络安全实验平台' }
      },
      {
        path: 'course/:id',
        name: 'StudentCourseDetail',
        component: () => import('../pages/Student/CourseDetail.vue'),
        meta: { title: '课程详情 - 网络安全实验平台' }
      },
      {
        path: 'experiments',
        name: 'StudentExperiments',
        component: () => import('../pages/Student/ExperimentList.vue'),
        meta: { title: '实验列表 - 网络安全实验平台' }
      },
      { path: 'experiment/:id', name: 'StudentExperiment', component: StudentExperiment, meta: { title: '实验页面 - 网络安全实验平台' } },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: StudentProfile,
        meta: { title: '个人中心 - 网络安全实验平台' }
      },
      {
        path: 'ranking',
        name: 'StudentRanking',
        component: () => import('../pages/Student/Ranking.vue'),
        meta: { title: '排行榜 - 网络安全实验平台' }
      },
      {
        path: 'community',
        name: 'StudentCommunity',
        component: () => import('../pages/Student/Community.vue'),
        meta: { title: '学习社区 - 网络安全实验平台' }
      },
      {
        path: 'ai-helper',
        name: 'StudentAIHelper',
        component: () => import('../pages/Student/AIHelper.vue'),
        meta: { title: 'AI助手 - 网络安全实验平台' }
      }
    ]
  },
  
  // 教师端路由
  {
    path: '/teacher',
    name: 'Teacher',
    redirect: '/teacher/courses',
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: 'courses',
        name: 'TeacherCourseManage',
        component: () => import('../pages/Teacher/CourseManage.vue'),
        meta: { title: '课程管理 - 网络安全实验平台' }
      },
      {
        path: 'experiments',
        name: 'TeacherExperimentManage',
        component: () => import('../pages/Teacher/ExperimentManage.vue'),
        meta: { title: '实验管理 - 网络安全实验平台' }
      },
      {
        path: 'students',
        name: 'TeacherStudentManage',
        component: () => import('../pages/Teacher/StudentManage.vue'),
        meta: { title: '学生管理 - 网络安全实验平台' }
      },
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('../pages/Teacher/Profile.vue'),
        meta: { title: '个人中心 - 网络安全实验平台' }
      }
    ]
  },
  
  // 管理员端路由
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../pages/Admin/Dashboard.vue'),
        meta: { title: '管理员首页 - 网络安全实验平台' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../pages/Admin/Profile.vue'),
        meta: { title: '管理员中心 - 网络安全实验平台' }
      },
      {
        path: 'courses',
        name: 'AdminCourseManage',
        component: () => import('../pages/Admin/CourseManage.vue'),
        meta: { title: '课程管理 - 网络安全实验平台' }
      },
      {
        path: 'experiments',
        name: 'AdminExperimentManage',
        component: () => import('../pages/Admin/ExperimentManage.vue'),
        meta: { title: '实验管理 - 网络安全实验平台' }
      },
      {
        path: 'students',
        name: 'AdminStudentManage',
        component: () => import('../pages/Admin/StudentManage.vue'),
        meta: { title: '学生管理 - 网络安全实验平台' }
      },
      {
        path: 'classes',
        name: 'AdminClassManage',
        component: () => import('../pages/Admin/ClassManage.vue'),
        meta: { title: '班级管理 - 网络安全实验平台' }
      }
    ]
  },
  
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/Student/Profile.vue'),
    meta: { requiresAuth: false, title: '页面不存在 - 网络安全实验平台' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from) => {
  console.log('路由守卫 - 访问路径:', to.path)
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 从localStorage获取用户信息
  const userInfoStr = localStorage.getItem('userInfo')
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  let userInfo = null
  
  if (userInfoStr && isLoggedIn === 'true') {
    try {
      userInfo = JSON.parse(userInfoStr)
      // 移除打印完整用户信息的日志，保护用户隐私
      // console.log('路由守卫 - 用户信息:', userInfo)
    } catch (error) {
      console.error('解析用户信息失败', error)
      // 清除错误的用户信息
      localStorage.removeItem('userInfo')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('token')
    }
  } else {
    // 移除打印用户信息的日志，保护用户隐私
    // console.log('路由守卫 - 用户信息:', null)
  }
  
  // 检查是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  console.log('路由守卫 - 是否需要登录:', requiresAuth)
  
  if (requiresAuth) {
    if (!userInfo) {
      // 未登录，跳转到登录页
      console.log('路由守卫 - 未登录，跳转到登录页')
      return { name: 'Login', query: { redirect: to.fullPath } }
    } else {
      // 已登录，检查角色权限
      const requiredRole = to.matched.find(record => record.meta.role)?.meta.role
      console.log('路由守卫 - 需要的角色:', requiredRole)
      
      if (requiredRole && requiredRole !== userInfo.role) {
        // 角色不匹配，跳转到对应角色的首页
        console.log('路由守卫 - 角色不匹配，跳转到对应角色的首页')
        switch (userInfo.role) {
          case 'student':
            return { name: 'StudentDashboard' }
          case 'teacher':
            return { name: 'TeacherCourseManage' }
          case 'admin':
            return { name: 'AdminDashboard' }
          default:
            return { name: 'Login' }
        }
      }
      // 角色匹配，继续访问
      console.log('路由守卫 - 已登录且角色匹配，继续访问')
      return true
    }
  } else {
    // 不需要登录的页面，允许所有用户访问，包括已登录用户
    // 移除已登录用户访问登录页时的自动跳转，让用户可以切换账号登录
    console.log('路由守卫 - 不需要登录，继续访问')
    return true
  }
})

export default router