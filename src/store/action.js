export const setUserAddress = (address) => {
  return {
    type: 'SET_USER_ADDRESS',
    value: address
  }
}

export const setCrossChainData = (address) => {
  return {
    type: 'SET_CROSS_CHAIN_DATA',
    value: address
  }
}

export const setPiUsdt = (value) => {
  return {
    type: 'SET_PI_USDT',
    value
  }
}