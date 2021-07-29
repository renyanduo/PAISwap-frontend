import React, { useEffect } from 'react'
import './index.scss'
import Button from '@/components/ConnectButton'
import ConnectWallet from '@/components/ConnectWallet'
import logo from '@/assets/images/logo.png'
import { message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { setUserAddress } from '@/store/action'

function Index(props) {
  const [address, setAddress] = React.useState('')
  const userAddress = useSelector((state) => state.address)
  const dispatch = useDispatch()
  console.log(userAddress)


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
    }
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      const { ethereum } = window
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log(accounts)
      setAddress(accounts[0])
      dispatch(
        setUserAddress({
          address: accounts[0]
        })
      )
      console.log(userAddress)
      window.sessionStorage.setItem('address', accounts[0])
      // setParent(accounts[0])
    } catch (error) {
      message.error(error.message)
    }
  }

  return (
    <header className="header">
      <div className="header-wrap flex justify-between items-center	">
        <img src={logo} alt="piswap" className="logo" />
        <div className="header-title">Home</div>
        <div>
          <ConnectWallet>
            <Button>{userAddress ? userAddress : 'Connect Wallet'}</Button>
          </ConnectWallet>
        </div>
      </div>
    </header>
  )
}

export default Index
