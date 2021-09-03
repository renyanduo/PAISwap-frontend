import React, { useEffect } from 'react'
import './index.scss'
import Button from '@/components/ConnectButton'
import ConnectWallet from '@/components/ConnectWallet'
import logo from '@/assets/images/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { setUserAddress } from '@/store/action'
import { message } from 'antd'

import burger from '@/assets/images/burger.png'

function Index(props) {
  const userAddress = useSelector(state => state.address)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const isMobile = () => {
    return /(iphone|ipad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase())
  }

  function jump(route) {
    history.push(route)
  }

  useEffect(() => {
    // dispatch(
    //   setUserAddress({
    //     address: window.ethereum.selectedAddress || ''
    //   })
    // )
    // if (isMobile()) {
    //   document.getElementById('root').style.display = 'none'
    //   message.error('The mobile version is temporarily unavailable, please use the desktop version')
    // }
  }, [])

  window.ethereum && window.ethereum.on('chainChanged', _chainId => window.location.reload())

  window.ethereum &&
    window.ethereum.on('accountsChanged', accounts => {
      console.log(accounts)
      dispatch(
        setUserAddress({
          address: accounts[0]
        })
      )
    })

  return (
    <header className="flex items-center header">
      <div className="flex items-center justify-between header-wrap flex-nowrap">
        <img src={logo} alt="piswap" className="logo" />
        <>
        <div className="hidden header-title sm:block">
          <span
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => {
              jump('/')
            }}>
            HOME
          </span>
          <span
            className={location.pathname === '/pool' ? 'active' : ''}
            onClick={() => {
              jump('/pool')
            }}>
            POOL
          </span>
          <span
            className={location.pathname === '/l2wallet' ? 'active' : ''}
            onClick={() => {
              jump('/l2wallet?withdraw')
            }}>
            L2 WALLET
          </span>
        </div>
        <div className="block header-title sm:hidden">
          {
            location.pathname === '/l2wallet' ? 'L2 WALLET' : 'HOME'
          }
        </div>
        </>
        <>
        <div className="hidden mt-4 sm:mt-0 sm:block">
          <ConnectWallet>
            <Button>{userAddress ? userAddress : 'Connect Wallet'}</Button>
          </ConnectWallet>
        </div>
        <div className="block burger sm:hidden">
          <img src={burger} alt="" />
        </div>
        </>
      </div>
    </header>
  )
}

export default Index
