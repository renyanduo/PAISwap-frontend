import React, { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Web3 from 'web3'
import { crossChainABI, CROSS_CONTRACCT_ADDRESS, gas, gasPrice } from '@/util/abi'
import { message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import request from '@/util/request'
import { setCrossChainData } from '@/store/action'

import piLogo from '@/assets/images/pi.png'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
}

const Index = () => {
  const [address, setAddress] = useState('')
  const [activeTab, setActiveTab] = useState('deposit')
  const [balance, setBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const userAddress = useSelector(state => state.address)
  const crossChainData = useSelector(state => state.crossChainData)

  const dispatch = useDispatch()

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
    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    const balance = depositAmount

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .DepositInMainChain('child_test')
      .send({
        from: address,
        chainId: 'testnet',
        value: web3.utils.toWei(balance, 'ether'),
        gas: gas,
        gasPrice: gasPrice
      })
      .on('transactionHash', function (hash) {
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
        message.success('Swaped successfully, please check your balance!')
        console.log(receipt)
        debugger
        switchPlinChain('toChild').then(function (result) {
          if (result == null) {
            dispatch(
              setCrossChainData({
                crossChainData: {
                  type: 'deposit',
                  balance,
                  transactionHash: receipt.transactionHash
                }
              })
            )
            // window.location.reload() // 切换完成刷新页面
          }
        })
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  const childToMain = () => {
    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    const balance = withdrawAmount

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .WithdrawFromChildChain('child_test')
      .send({
        from: address,
        chainId: 'child_test',
        value: web3.utils.toWei(balance, 'ether'),
        gas: gas,
        gasPrice: gasPrice
      })
      .on('transactionHash', function (hash) {
        message.info(hash, 'Waiting for tx confirmation:')
      })
      .on('receipt', function (receipt) {
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
                switchPlinChain().then(function (result) {
                  debugger
                  if (result == null) {
                    debugger
                    dispatch(
                      setCrossChainData({
                        crossChainData: {
                          type: 'withdraw',
                          balance,
                          transactionHash: receipt.transactionHash
                        }
                      })
                    )
                    // window.location.reload() // 切换完成刷新页面
                  }
                })
              } else {
                message.error('please waiting')
              }
            })
            .catch(err => {
              message.error(err.message)
              clearInterval(timer)
            })
        }, 5000)
      })
      .on('error', function (error, receipt) {
        if (!error.message) {
          message.error('Swap failure', error.toString())
        } else {
          message.error(error.message)
        }
      })
  }

  const checkTransaction = type => {
    console.log('check')
    if (!Object.keys(crossChainData).length) return

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    if (crossChainData.type === 'deposit') {
      MyContract.methods
        .DepositInChildChain('child_test', crossChainData.transactionHash)
        .send({
          from: userAddress,
          chainId: 'child_test'
          // gas: gas,
          // gasPrice: gasPrice
        })
        .on('transactionHash', function (hash) {
          message.info(hash, 'Waiting for tx confirmation:')
        })
        .on('receipt', function (receipt) {
          message.success('Swaped successfully, please check your balance!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
        })
        .on('error', function (error, receipt) {
          if (!error.message) {
            message.error('Swap failure', error.toString())
          } else {
            message.error(error.message)
          }
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
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
          chainId: 'testnet'
          // gas: gas,
          // gasPrice: gasPrice
        })
        .on('transactionHash', function (hash) {
          message.info(hash, 'Waiting for tx confirmation:')
        })
        .on('receipt', function (receipt) {
          message.success('Swaped successfully, please check your balance!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
        })
        .on('error', function (error, receipt) {
          if (!error.message) {
            message.error('Swap failure', error.toString())
          } else {
            message.error(error.message)
          }
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
        })
    }
  }

  const switchPlinChain = async type => {
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

  useEffect(() => {
    setAddress(window.ethereum.selectedAddress ? window.ethereum.selectedAddress : '')
    address && getBalance()
  })

  useEffect(() => {
    checkTransaction()
  }, [])

  window.ethereum.on('chainChanged', _chainId => window.location.reload())

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
              <input value={userAddress} readOnly />
            </div>
            <div className="modal-cell">
              <div className="modal-title">Deposit Amount:</div>
            </div>
            <div className="modal-input">
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
              <input value={userAddress} readOnly />
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
            <div className="balance">Balance: {balance} PI</div>
            <Button style={{ margin: '0 auto' }} onClick={childToMain}>
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Index
