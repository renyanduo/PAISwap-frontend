import React, { useState, useEffect } from 'react'
import './index.scss'
import Button from '@/components/Button'
import ConnectWallet from '@/components/ConnectWallet'
import Web3 from 'web3'
import { ABI, PNFT_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '@/util/abi'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import { numFormat } from '@/util'
import Loading from '@/components/loading'
import SmallModal from '@/components/SmallModal'

import banner from '@/assets/images/banner.png'
import pizza from '@/assets/images/pizza2.png'

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
  const [showLoading, setShowLoading] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)

  const userAddress = useSelector(state => state.address)
  // 质押
  const deposit = () => {
    if (+depositAmount > +balance || !depositAmount || +depositAmount < 0) {
      message.error('invalid input')
      return
    }
    setShowLoading(true)

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
      .then(receipt => {
        message.success('Swaped successfully, please check your balance!')
        setShowModal(false)
        setShowLoading(false)
        getStaking()
        getTotalBalance()
      })
      .catch(error => {
        message.error(error.message)
        setShowLoading(false)
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
        setExtractAmount(web3.utils.fromWei(result))
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
        console.log('pending', web3.utils.fromWei(result))
      })
      .catch(err => message.error(err.message))
  }

  const withdraw = () => {
    if (+extractAmount > +stakingAmount || !extractAmount || +extractAmount < 0) {
      message.error('invalid input')
      return
    }

    setShowLoading(true)

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
      .then(receipt => {
        message.success('Swaped successfully, please check your balance!')
        setShowModal(false)
        setShowLoading(false)
        getStaking()
        getTotalBalance()
      })
      .catch(error => {
        message.error(error.message)
        setShowLoading(false)
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
      .balanceOf(PISTAKING_CONTRACT_ADDRESS)
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

  const switchPlianChain = async type => {
    const { ethereum } = window
    try {
      const flag = await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: type === 'toChild' ? '0x999d4b' : '0xfe3005' }]
      })
      console.log(flag)
      return flag
    } catch (switchError) {
      console.log(switchError)
      message.error(switchError.message)
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        // return false
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              type === 'toChild'
                ? {
                    chainId: '0x999d4b',
                    chainName: 'Plian-subchain1test',
                    rpcUrls: ['https://testnet.plian.io/child_test'],
                    blockExplorerUrls: ['https://testnet.plian.org/child_test'],
                    nativeCurrency: {
                      symbol: 'PI',
                      decimals: 18
                    }
                  }
                : {
                    chainId: '0xfe3005',
                    chainName: 'Plian-mainchaintest',
                    rpcUrls: ['https://testnet.plian.io/testnet'],
                    blockExplorerUrls: ['https://testnet.plian.org/testnet'],
                    nativeCurrency: {
                      symbol: 'PI',
                      decimals: 18
                    }
                  }
            ]
          })
        } catch (addError) {
          // handle "add" error
          message.error(addError.message)
        }
      }
      // handle other "switch" errors
    }
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
    setAddress(window.ethereum.selectedAddress || '')
    // getTotalBalance()
    // address && getPendingReward()
    // getTotalSupply()
    // address && getStaking()
  })

  useEffect(() => {
    if (!isMetaMaskInstalled()) return
    if (window.ethereum.chainId === '0x999d4b') {
      address && getStaking()
      address && getPendingReward()
      getTotalBalance()
      getTotalSupply()
    } else {
      address && message.error('wrong chain id')
      setShowSwitch(true)
    }
  }, [address])

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
            <div className="modal-amount">{numFormat(balance)} PI</div>
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
            Unstake & harvest
          </Button>
        </>
      ) : null}
    </div>
  )

  return (
    <div className="main">
      <div className="banner">
        <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
          <img src={banner} alt="" />
        </a>
      </div>
      {userAddress ? (
        <>
          <div className="content flex flex-wrap sm:flex-nowrap">
            <div className="box mr-0 sm:mr-14 sm:w-1/2 w-full items-center">
              <div className="box-title">Total staked</div>
              <div className="box-amount">{numFormat(totalSupply)} PI</div>
              <div className="box-highlight">PNFT mining reward (Total undistributed)</div>
              <div className="box-amount">{numFormat(totalBalance)}</div>
            </div>
            <div className="box sm:w-1/2 w-full items-center">
              <div className="box-title">PI staked</div>
              <div className="box-amount">{numFormat(stakingAmount)}</div>
              <Button onClick={() => depositClick('deposit')} style={{ height: '42px' }}>
                Stake
              </Button>
              <div className="box-title">PNFT earned</div>
              <div className="box-amount">{numFormat(pendingReward)}</div>
              <Button onClick={() => depositClick('extract')} style={{ height: '42px' }}>
                Harvest
              </Button>
            </div>
          </div>
        </>
      ) : (
        <ConnectWallet>
          <Button className="connect-btn">Connect Wallet</Button>
        </ConnectWallet>
      )}
      {showModal ? modal : null}
      <Loading show={showLoading} />
      <SmallModal show={showSwitch}>
        <div className="switch-modal flex flex-col items-center">
          <div className="title">Switch Network</div>
          <div className="switch-btn flex items-center justify-center" onClick={()=>{switchPlianChain('toChild')}}><img src={pizza} alt="" /> Switch to Plian Child</div>
          <div className="desc">Pizzap is running on Plian child chain, you should switch your current network to Plian child.</div>
        </div>
      </SmallModal>
    </div>
  )
}

export default Index
