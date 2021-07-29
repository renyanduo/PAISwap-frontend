import React, { useState, useEffect } from 'react'
import './index.scss'
import Button from '@/components/Button'
import Footer from '@/components/app-footer'
import ConnectWallet from '@/components/ConnectWallet'
import Web3 from 'web3'
import { ABI, PNFT_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '@/util/abi'
import { message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

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
  const [totalSupply, setTotalSupply] = useState(0)
  const [userBalance, setUserBalance] = useState(0) // 挖矿赚取PNFT
  const [stakingAmount, setStakingAmount] = useState(0)
  const [pendingReward, setPendingReward] = useState(0) // 挖矿赚取
  const [balance, setBalance] = useState(0) // 钱包余额
  const [extractAmount, setExtractAmount] = useState('') // 提取
  const userAddress = useSelector(state => state.address)
  const dispath = useDispatch()

  // 质押
  const deposit = () => {
    if (+depositAmount > +balance) {
      message.error('invalid input')
      return
    }

    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)

    const balance_ = depositAmount.toString()

    console.log(balance_, web3.utils.toWei(balance_, 'ether'))

    MyContract.methods
      .deposit()
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice,
        value: web3.utils.toWei(balance_, 'ether')
      })
      .on('transactionHash', function (hash) {
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
        message.success('Swaped successfully, please check your balance!')
        setShowModal(false)
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  // 质押Pi
  const getStaking = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .getStaking(address)
      .call()
      .then(function (result) {
        setStakingAmount(web3.utils.fromWei(result))
        console.log('staking', web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const getPendingReward = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .pendingReward(address)
      .call()
      .then(function (result) {
        setPendingReward(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const withdraw = () => {
    if (+extractAmount > +stakingAmount) {
      message.error('invalid input')
      return
    }

    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)

    const balance = extractAmount.toString()

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .withdraw(web3.utils.toWei(balance, 'ether'))
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice
      })
      .on('transactionHash', function (hash) {
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
        message.success('Swaped successfully, please check your balance!')
        setShowModal(false)
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  // 质押总量
  const getTotalSupply = () => {
    let MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
    MyContract.methods
      .getTotalSupply()
      .call()
      .then(function (result) {
        console.log(web3.utils.fromWei(result))
        setTotalSupply(web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  // 挖矿赚取PNFT
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

  // 待挖取
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

  // 钱包余额
  const getBalance = async () => {
    try {
      const { ethereum } = window
      const bal = await ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      setBalance(web3.utils.fromWei(bal.toString(), 'ether'))
    } catch (error) {
      setBalance(0)
      message.error(error.message.toString())
    }
  }

  const checkAddress = () => {
    return Boolean(userAddress)
  }

  const depositClick = tab => {
    if (!checkAddress()) {
      message.error('please connect wallet')
      return
    }
    setShowModal(true)
    setActiveTab(tab)
    getPendingReward()
    getBalance()
  }

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      message.error('need to install metamask')
      return
    }
    setAddress(window.ethereum.selectedAddress ? window.ethereum.selectedAddress : '')
    getTotalBalance()
    userAddress && getPendingReward()
    getTotalSupply()
    userAddress && getStaking()
  })

  const modal = (
    <div className="modal">
      <div className="modal-close" onClick={() => setShowModal(false)}>
        &times;
      </div>
      <div className="tab">
        <div
          className={`tab-item ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}>
          Stake
        </div>
        <div
          className={`tab-item ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}>
          Harvest
        </div>
      </div>
      {activeTab === 'deposit' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">Stake amount</div>
          </div>
          <div className="modal-input">
            <div className="modal-input-max" onClick={() => setDepositAmount(balance.toString())}>
              MAX
            </div>
            <input
              type="number"
              onChange={e => setDepositAmount(e.target.value)}
              value={depositAmount}
              placeholder="Please enter the number"
            />
            <div>PI</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">Balance available</div>
            <div className="modal-amount">{balance} PI</div>
          </div>
          <Button className="submit" onClick={deposit}>
            Stake
          </Button>
        </>
      ) : null}

      {activeTab === 'extract' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">Staked</div>
          </div>
          <div className="modal-input">
            <input
              type="number"
              value={extractAmount}
              onChange={e => setExtractAmount(e.target.value)}
              placeholder={`Max: ${stakingAmount}`}
            />
            <div>PI</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">Earned</div>
          </div>
          <div className="modal-input">
            <input value={pendingReward} readOnly />
            <div>PNFT</div>
          </div>
          <Button className="submit" onClick={withdraw}>
            Harvest
          </Button>
        </>
      ) : null}
    </div>
  )

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" />
      </div>
      {userAddress ? (
        <>
          <div className="content flex flex-wrap sm:flex-nowrap">
            <div className="box mr-0 sm:mr-14 sm:w-1/2 w-full items-center">
              <div className="box-title">Total staked</div>
              <div className="box-amount justify-center">{totalSupply} PI</div>
              <div className="box-highlight">PNFT mining reward (Total undistributed)</div>
              <div className="box-amount justify-center">{totalBalance}</div>
            </div>
            <div className="box sm:w-1/2 w-full items-start">
              <div className="box-title">Stake PI</div>
              <div className="box-amount justify-between">
                <div className="box-amount-num">{stakingAmount}</div>
                <Button onClick={() => depositClick('deposit')}>Stake</Button>
              </div>
              <div className="box-title">PNFT earned</div>
              <div className="box-amount justify-between">
                <div className="box-amount-num">{pendingReward}</div>
                <Button onClick={() => depositClick('extract')}>Harvest</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ConnectWallet>
          <Button className="connect-btn">Connect Wallet</Button>
        </ConnectWallet>
      )}
      {showModal ? modal : null}
      <Footer />
    </>
  )
}

export default Index
