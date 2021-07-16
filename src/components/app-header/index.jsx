import React from 'react'
import './index.scss'
import logo from '@/assets/images/logo.png'

function Index(props) {
  return (
    <header className="header">
      <div className="header-wrap flex justify-between items-center	">
        <img src={logo} alt="pizzap" className="logo" />
        <div>
          <span>Swap</span>
          <span>Pool</span>
        </div>
        <div>
          Connect Wallet
        </div>
      </div>
    </header>
  )
}

export default Index
