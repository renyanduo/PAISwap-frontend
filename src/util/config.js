// 本地测试API
const devBaseURL = 'https://testnet.plian.org'

// 已经部署到服务器上的API
const proBaseURL = 'https://testnet.plian.org'
export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL

export const TIMEOUT = 50000

export const TESTNET_MAIN = {
  chainId: '0xfe3005',
  chainName: 'Plian-mainchaintest',
  rpcUrls: ['https://testnet.plian.io/testnet'],
  blockExplorerUrls: ['https://testnet.plian.org/testnet'],
  nativeCurrency: {
    symbol: 'PI',
    decimals: 18
  }
}

export const TESTNET_CHILD = {
  chainId: '0x999d4b',
  chainName: 'Plian-subchain1test',
  rpcUrls: ['https://testnet.plian.io/child_test'],
  blockExplorerUrls: ['https://testnet.plian.org/child_test'],
  nativeCurrency: {
    symbol: 'PI',
    decimals: 18
  }
}

export const MAINNET_MAIN = {
  chainId: '0x2007d4',
  chainName: 'Plian-L1 wallet',
  rpcUrls: ['https://mainnet.plian.io/pchain'],
  blockExplorerUrls: ['https://piscan.plian.org/pchain'],
  nativeCurrency: {
    symbol: 'PI',
    decimals: 18
  }
}

export const MAINNET_CHILD = {
  chainId: '0x7a3038',
  chainName: 'Plian-L2 wallet',
  rpcUrls: ['https://mainnet.plian.io/child_0'],
  blockExplorerUrls: ['https://piscan.plian.org/child_0'],
  nativeCurrency: {
    symbol: 'PI',
    decimals: 18
  }
}