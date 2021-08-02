import axios from 'axios'
import { BASE_URL, TIMEOUT } from './config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { message } from 'antd'
NProgress.configure({ showSpinner: false })

const instance = axios.create({
  // 默认的配置
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {},
  withCredentials: false
})

instance.interceptors.request.use(
  // 请求拦截
  config => {
    // 1.发送网络请求时, 在界面的中间位置显示Loading的组件
    NProgress.start() // 启动滚动条
    // 2.某一些请求要求用户必须携带token, 如果没有携带, 那么直接跳转到登录页面

    // 3.params/data序列化的操作
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
instance.interceptors.response.use(
  // 响应拦截
  res => {
    NProgress.done() // 关闭滚动条
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        //   store.dispatch('FedLogOut').then(() => {
        //     location.reload()
        //   })
      }
      return Promise.reject(res || 'error')
    // } else if (res.result !== 'success') {
    //   if (+res.code === 1001) {
    //     // token失效
    //     // 去登录
    //   }
    //   return Promise.reject(res.message || 'error')
    } else {
      return Promise.resolve(res.data)
    }
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('请求错误')
          break
        case 401:
          console.log('未授权访问')
          break
        default:
          console.log('其他错误信息')
      }
    }
    // return err
    console.log('err' + err) // for debug
    message.error(err.message)
    return Promise.reject(err.message)
  }
)

export default instance
