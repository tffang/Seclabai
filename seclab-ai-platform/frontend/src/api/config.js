import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API的基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 打印完整的错误信息
    console.log('API错误:', error)
    if (error.response) {
      console.log('错误响应:', error.response)
      console.log('错误状态:', error.response.status)
      console.log('错误数据:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default apiClient
