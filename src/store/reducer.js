// 根据业务设置默认数据
const defaultState = {
  address: '',
  crossChainData: {}
}
/**
 *
 * state 整个 store 的数据，修改前的 store
 * action 传递过来的 action
 */
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_USER_ADDRESS':
      return {
        ...state,
        ...action.value
      }
    case 'SET_CROSS_CHAIN_DATA':
      return {
        ...state,
        ...action.value
      }
    default:
      return state
  }
}
// Tip: reducer 可以接受 state，但是绝不能修改 state
