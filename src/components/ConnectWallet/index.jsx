import React from 'react'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { setUserAddress } from '@/store/action'

function Index(props) {
  const dispatch = useDispatch()

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  const isMobile = () => {
    return /(iphone|ipad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase())
  }

  const connect = async () => {
    if (!isMetaMaskInstalled() && isMobile()) {
      window.location.href = 'https://metamask.app.link/dapp/' + window.location.host
      return
    } else if (!isMetaMaskInstalled()) {
      message.error('need to install metamask')
      return
    }
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      const { ethereum } = window
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log(accounts)
      dispatch(
        setUserAddress({
          address: accounts[0]
        })
      )
      const iframe = document.getElementById('iframe')
      iframe && iframe.contentWindow.location.reload()
    } catch (error) {
      // message.error(error.message)
    }
  }


  return <div onClick={connect}>{ props.children }</div>
}

export default Index
