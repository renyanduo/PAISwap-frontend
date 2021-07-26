import React, { useState, useEffect } from 'react'
import './index.scss'
import { ThemeContext } from 'styled-components'
import Button from '@/components/Button'
import Web3 from 'web3'
import { ABI, PNFT_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '@/util/abi'
import { message } from 'antd'

import banner from '@/assets/images/banner.png'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
}

const Index = () => {
  const [address, setAddress] = useState('')
  const [activeTab, setActiveTab] = useState('deposit')
  const [showModal, setShowModal] = React.useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [totalBalance, setTotalBalance] = useState(0)
  const [userBalance, setUserBalance] = useState(0)

  const deposit = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)

    const balance = document.getElementById('balance').value

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .deposit()
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice,
        value: web3.utils.toWei(balance, 'ether')
      })
      .on('transactionHash', function (hash) {
        // swapButton.disabled = true
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
        message.success('Swaped successfully, please check your balance!')
        // swapButton.disabled = false
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  const getStakingButtonOnClick = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .getStaking(address)
      .call()
      .then(function (result) {
        message.info(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const pendingRewardButtonOnClick = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .pendingReward(address)
      .call()
      .then(function (result) {
        message.info(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const withdraw = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)

    const balance = document.getElementById('balance').value

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .withdraw(web3.utils.toWei(balance, 'ether'))
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice
      })
      .on('transactionHash', function (hash) {
        // swapButton.disabled = true
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
        message.success('Swaped successfully, please check your balance!')
        // swapButton.disabled = false
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  const getTotalSupplyButtonOnClick = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .getTotalSupply()
      .call()
      .then(function (result) {
        message.info(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const getUserBalance = () => {
    let MyContract = new web3.eth.Contract(ABI, PNFT_CONTRACT_ADDRESS)
    MyContract.methods
      .balanceOf(address)
      .call()
      .then(function (result) {
        console.log(web3.utils.fromWei(result))
        setUserBalance(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const getTotalBalance = () => {
    let MyContract = new web3.eth.Contract(ABI, PNFT_CONTRACT_ADDRESS)
    MyContract.methods
      .balanceOf('0xbBeAB8d29458ac35Ac455669949A8907A2307787')
      .call()
      .then(result => {
        setTotalBalance(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  useEffect(() => {
    setAddress(window.sessionStorage.getItem('address'))
    // getTotalBalance()
    // getUserBalance()
  }, [])

  const modal = (
    <div className="modal">
      <div className="modal-close" onClick={() => setShowModal(false)}>
        &times;
      </div>
      <div className="tab">
        <div
          className={`tab-item ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}>
          质押
        </div>
        <div
          className={`tab-item ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}>
          提取
        </div>
      </div>
      {activeTab === 'deposit' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">质押数量</div>
          </div>
          <div className="modal-input">
            <div className="modal-input-max" onClick={()=>setDepositAmount(userBalance.toString())}>MAX</div>
            <input type="number" onChange={e => setDepositAmount(e.target.value)} />
            <div>Pi</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">钱包余额</div>
            <div className="modal-amount">{userBalance} PI</div>
          </div>
          <Button className="submit" onClick={deposit}>质押</Button>
        </>
      ) : null}

      {activeTab === 'extract' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">已质押</div>
          </div>
          <div className="modal-input">
            <input type="number" />
            <div>Pi</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">挖矿赚取</div>
          </div>
          <div className="modal-input">
            <input type="number" />
            <div>PNFT</div>
          </div>
          <Button className="submit" onClick={withdraw}>提取</Button>
        </>
      ) : null}
    </div>
  )

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" />
      </div>

      <Button onClick={getTotalBalance}>aaaa</Button>

      <div className="content">
        <div className="box">
          <div className="box-title">当前全网质押总量为</div>
          <div className="box-amount">{totalBalance} PI</div>
          <div className="box-highlight">待挖取PNFT数量</div>
          <div className="box-amount">1,000,000</div>
        </div>
        <div className="box">
          <div className="box-title">质押Pi</div>
          <div className="box-amount">
            <div>0.00</div>
            <Button onClick={()=>{setShowModal(true);setActiveTab('deposit')}}>质押</Button>
          </div>
          <div className="box-title">挖矿赚取PNFT</div>
          <div className="box-amount">
            <div>0.00</div>
            <Button onClick={()=>{setShowModal(true);setActiveTab('extract')}}>提取</Button>
          </div>
        </div>
      </div>
      {showModal ? modal : null}
    </>
  )
}

export default Index
