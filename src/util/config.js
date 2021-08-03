// 本地测试API
const devBaseURL = 'https://testnet.plian.org'

// 已经部署到服务器上的API
const proBaseURL = 'https://testnet.plian.org'
export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL

export const TIMEOUT = 50000
