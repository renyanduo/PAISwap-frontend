import React, { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Web3 from 'web3'
import { crossChainABI, CROSS_CONTRACCT_ADDRESS, gasl2, gasPricel2 } from '@/util/abi'
import { message, Modal } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import request from '@/util/request'
import { setCrossChainData } from '@/store/action'
import { numFormat } from '@/util'
import Loading from '@/components/loading'
import { useHistory, useLocation } from 'react-router-dom'

import piLogo from '@/assets/images/pi.png'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
}

const Index = props => {
  const [address, setAddress] = useState('')
  const [activeTab, setActiveTab] = useState('deposit')
  const [balance, setBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showLoading, setShowLoading] = useState(false)
  const userAddress = useSelector(state => state.address)
  const crossChainData = useSelector(state => state.crossChainData)

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

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

  const mainToChind = () => {
    if (!depositAmount || +depositAmount < 0 || +depositAmount > +balance) {
      message.error('invalid input')
      return
    }

    if (window.ethereum.chainId !== '0xfe3005') {
      Modal.confirm({
        content: 'switch chain？',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {switchPlianChain()}
      })
      return
    }

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    setShowLoading(true)

    const depositbalance = depositAmount

    console.log(depositbalance, web3.utils.toWei(depositbalance, 'ether'))

    MyContract.methods
      .DepositInMainChain('child_test')
      .send({
        from: address,
        chainId: 'testnet',
        value: web3.utils.toWei(depositbalance, 'ether'),
        gas: gasl2,
        gasPrice: gasPricel2
      })
      .then(receipt => {
        // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
        message.success('Swaped successfully, please check your balance!')
        console.log(receipt)
        switchPlianChain('toChild').then(function (result) {
          if (result === null) {
            setShowLoading(false)
            dispatch(
              setCrossChainData({
                crossChainData: {
                  type: 'deposit',
                  balance: depositbalance,
                  transactionHash: receipt.transactionHash
                }
              })
            )
          }
        })
      })
      .catch(error => {
        message.error(error.message)
        setShowLoading(false)
      })
  }

  const childToMain = () => {
    if (!withdrawAmount || +withdrawAmount < 0 || +withdrawAmount > +balance) {
      message.error('invalid input')
      return
    }

    if (window.ethereum.chainId !== '0x999d4b') {
      Modal.confirm({
        content: 'switch chain？',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk() {switchPlianChain('toChild')}
      })
      return
    }

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)
    setShowLoading(true)

    const withdrawbalance = withdrawAmount

    console.log(withdrawbalance, web3.utils.toWei(withdrawbalance, 'ether'))

    MyContract.methods
      .WithdrawFromChildChain('child_test')
      .send({
        from: address,
        chainId: 'child_test',
        value: web3.utils.toWei(withdrawbalance, 'ether'),
        gas: gasl2,
        gasPrice: gasPricel2
      })
      .then(receipt => {
        message.success('Swaped successfully, please check your balance!')
        console.log(receipt)
        //调用 post https://testnet.plian.org/getChildTxInMainChain 返回sucess 执行下面步骤
        let timer = setInterval(() => {
          request({
            url: `/getChildTxInMainChain`,
            method: 'post',
            data: {
              txHash: receipt.transactionHash,
              chainId: 1
            }
          })
            .then(res => {
              console.log(res)
              if (res.result === 'success') {
                clearInterval(timer)
                switchPlianChain()
                  .then(function (result) {
                    if (result === null) {
                      setShowLoading(false)
                      dispatch(
                        setCrossChainData({
                          crossChainData: {
                            type: 'withdraw',
                            balance: withdrawbalance,
                            transactionHash: receipt.transactionHash
                          }
                        })
                      )
                    } else {
                      message.error('switch error')
                      setShowLoading(false)
                    }
                  })
                  .catch(err => {
                    message.error(err.message)
                    setShowLoading(false)
                  })
              } else {
                message.error('please waiting')
              }
            })
            .catch(err => {
              message.error(err.message)
              setShowLoading(false)
              clearInterval(timer)
            })
        }, 5000)
      })
      .catch(error => {
        message.error(error.message)
        setShowLoading(false)
      })
  }

  const checkTransaction = () => {
    console.log('check')
    if (!Object.keys(crossChainData).length) return

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    setShowLoading(true)
    if (crossChainData.type === 'deposit') {
      MyContract.methods
        .DepositInChildChain('child_test', crossChainData.transactionHash)
        .send({
          from: userAddress,
          chainId: 'child_test',
          gas: gasl2,
          gasPrice: '0'
        })
        .then(receipt => {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          message.success('Swaped successfully, please check your balance!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          setShowLoading(false)
        })
        .catch(error => {
          message.error(error.message)
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          setShowLoading(false)
        })
    } else if (crossChainData.type === 'withdraw') {
      MyContract.methods
        .WithdrawFromMainChain(
          'child_test',
          web3.utils.toWei(crossChainData.balance, 'ether'),
          crossChainData.transactionHash
        )
        .send({
          from: userAddress,
          chainId: 'testnet',
          gas: gasl2,
          gasPrice: '0'
        })
        .then(receipt => {
          // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          message.success('Swaped successfully, please check your balance!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          setShowLoading(false)
        })
        .catch(error => {
          message.error(error.message)
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          setShowLoading(false)
        })
    }
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
                    blockExplorerUrls: ['https://testnet.plian.org/child_test']
                  }
                : {
                    chainId: '0xfe3005',
                    chainName: 'Plian-mainchaintest',
                    rpcUrls: ['https://testnet.plian.io/testnet'],
                    blockExplorerUrls: ['https://testnet.plian.org/testnet']
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

  const switchTab = type => {
    setActiveTab(type)
    history.replace({ pathname: '/l2wallet', search: type })
  }

  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      message.error('need to install metamask')
      return
    }
    setAddress(window.ethereum.selectedAddress || '')
    address && getBalance()
  })

  useEffect(() => {
    checkTransaction()
    setActiveTab(
      location.search
        ? location.search.substr(1)
        : history.replace({ pathname: '/l2wallet', search: 'deposit' })
    )
  }, [])

  return (
    <div className="main">
      <div className="l2-wallet-content">
        <div className="tab flex">
          <div
            className={`tab-item flex justify-center items-center ${
              activeTab === 'deposit' ? 'active' : ''
            }`}
            onClick={() => switchTab('deposit')}>
            Deposit
          </div>
          <div
            className={`tab-item flex justify-center items-center ${
              activeTab === 'withdraw' ? 'active' : ''
            }`}
            onClick={() => switchTab('withdraw')}>
            Withdraw
          </div>
        </div>

        {activeTab === 'deposit' ? (
          <>
            <div className="modal-cell">
              <div className="modal-title">Deposit form L1 account:</div>
            </div>
            <div className="modal-input">
              <input value={userAddress || ''} readOnly />
            </div>
            <div className="modal-cell">
              <div className="modal-title">Deposit Amount:</div>
            </div>
            <div className="modal-input" style={{ marginBottom: '13px' }}>
              <input
                type="number"
                onChange={e => setDepositAmount(e.target.value)}
                value={depositAmount}
                placeholder="Please enter the number"
              />
              <div className="flex items-center">
                <img className="pi-logo" src={piLogo} alt="" />
                PI
              </div>
            </div>
            <div className="balance">Balance: {numFormat(balance)} PI</div>
            <Button style={{ margin: '0 auto' }} onClick={mainToChind}>
              Submit
            </Button>
          </>
        ) : (
          <>
            <div className="modal-cell">
              <div className="modal-title">Withdrawal Address:</div>
            </div>
            <div className="modal-input">
              <input value={userAddress || ''} readOnly />
            </div>
            <div className="modal-cell">
              <div className="modal-title">Withdrawal Amount:</div>
            </div>
            <div className="modal-input" style={{ marginBottom: '13px' }}>
              <input
                type="number"
                onChange={e => setWithdrawAmount(e.target.value)}
                value={withdrawAmount}
                placeholder="Please enter the number"
              />
              <div className="flex items-center">
                <img className="pi-logo" src={piLogo} alt="" />
                PI
              </div>
            </div>
            <div className="balance">Balance: {numFormat(balance)} PI</div>
            <Button style={{ margin: '0 auto' }} onClick={childToMain}>
              Submit
            </Button>
          </>
        )}
      </div>
      <Loading show={showLoading} />
    </div>
  )
}

export default Index
