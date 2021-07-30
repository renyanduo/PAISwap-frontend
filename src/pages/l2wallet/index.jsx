import React, { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Web3 from 'web3'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import './index.scss'

import piLogo from '@/assets/images/pi.png'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('deposit')
  const [balance, setBalance] = useState(0)
  const userAddress = useSelector(state => state.address)

  // const getBalance = async () => {
  //   try {
  //     const { ethereum } = window
  //     const bal = await ethereum.request({
  //       method: 'eth_getBalance',
  //       params: [address, 'latest']
  //     })
  //     setBalance(web3.utils.fromWei(bal.toString(), 'ether'))
  //   } catch (error) {
  //     setBalance(0)
  //     message.error(error.message.toString())
  //   }
  // }

  return (
    <div className="main">
      <div className="l2-wallet-content">
        <div className="tab flex">
          <div
            className={`tab-item flex justify-center items-center ${
              activeTab === 'deposit' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('deposit')}>
            Deposit
          </div>
          <div
            className={`tab-item flex justify-center items-center ${
              activeTab === 'withdraw' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('withdraw')}>
            Withdraw
          </div>
        </div>

        {activeTab === 'deposit' ? (
          <>
            <div className="modal-cell">
              <div className="modal-title">Deposit form L1 account:</div>
            </div>
            <div className="modal-input">
              <input />
            </div>
            <div className="modal-cell">
              <div className="modal-title">Deposit Amount:</div>
            </div>
            <div className="modal-input">
              <input />
              <div className="flex items-center">
                <img className="pi-logo" src={piLogo} alt="" />
                PI
              </div>
            </div>
            <Button style={{ margin: '0 auto' }}>Submit</Button>
          </>
        ) : (
          <>
            <div className="modal-cell">
              <div className="modal-title">Withdrawal Address:</div>
            </div>
            <div className="modal-input">
              <input />
            </div>
            <div className="modal-cell">
              <div className="modal-title">Withdrawal Amount:</div>
            </div>
            <div className="modal-input" style={{marginBottom: '13px'}}>
              <input />
              <div className="flex items-center">
                <img className="pi-logo" src={piLogo} alt="" />
                PI
              </div>
            </div>
            <div className="balance">Balance: {balance} PI</div>
            <Button style={{ margin: '0 auto' }}>Submit</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Index
