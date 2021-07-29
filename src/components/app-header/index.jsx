import React, { useEffect } from 'react'
import './index.scss'
import Button from '@/components/ConnectButton'
import ConnectWallet from '@/components/ConnectWallet'
import logo from '@/assets/images/logo.png'
import { useSelector } from 'react-redux'

function Index(props) {
  const userAddress = useSelector(state => state.address)

  return (
    <header className="header">
      <div className="header-wrap flex justify-between items-center	">
        <img src={logo} alt="piswap" className="logo" />
        <div className="header-title">HOME</div>
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
