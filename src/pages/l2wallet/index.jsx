import React, { useState, useEffect } from 'react'
import Button from '@/components/Button'
import Web3 from 'web3'
import { crossChainABI, CROSS_CONTRACCT_ADDRESS, gasl2, gasPricel2 } from '@/util/abi'
import { message, Spin } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import './index.scss'
import request from '@/util/request'
import { setCrossChainData } from '@/store/action'
import { numFormat } from '@/util'
import SmallModal from '@/components/SmallModal'
import SwitchNetwork from '@/components/SwitchNetwork'
import { useHistory, useLocation } from 'react-router-dom'
import { TESTNET_MAIN, TESTNET_CHILD } from '@/util/config'

import piLogo from '@/assets/images/pi.png'
import pizza from '@/assets/images/pizza.png'
import wallet from '@/assets/images/wallet.png'
import arrow from '@/assets/images/arrow.png'
import warn from '@/assets/images/warn.png'
import hand from '@/assets/images/hand.png'

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
  const [showWaiting, setShowWaiting] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSwitch, setShowSwitch] = useState({show: false, onClick: null, text: ''})
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
      // message.error(error.message.toString())
    }
  }

  const mainToChind = () => {
    if (!depositAmount || +depositAmount < 0 || +depositAmount > +balance) {
      message.error('invalid input')
      return
    }

    // if (window.ethereum.chainId !== '0xfe3005') {
    if (window.ethereum.chainId !== '0x2007d4') {
      // setShowSwitch({show: true, onClick: () => {switchPlianChain()}, text: 'Switch to Plian-L1 Wallet'})
      switchPlianChain()
      return
    }

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    // setShowLoading(true)
    setShowWaiting(true)

    const depositbalance = depositAmount

    console.log(depositbalance, web3.utils.toWei(depositbalance, 'ether'))

    MyContract.methods
      .DepositInMainChain('child_0')
      .send({
        from: address,
        chainId: 'pchain',
        value: web3.utils.toWei(depositbalance, 'ether'),
        gas: gasl2,
        gasPrice: gasPricel2
      })
      .then(receipt => {
        // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
        message.success('Success!')
        console.log(receipt)
        switchPlianChain('toChild').then(function (result) {
          if (result === null) {
            // setShowLoading(false)
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
        // message.error(error.message)
        // setShowLoading(false)
        console.log(error.message)
        setShowError(true)
        setShowWaiting(false)
      })
  }

  const childToMain = () => {
    if (!withdrawAmount || +withdrawAmount < 0 || +withdrawAmount > +balance) {
      message.error('invalid input')
      return
    }

    // if (window.ethereum.chainId !== '0x999d4b') {
    if (window.ethereum.chainId !== '0x7a3038') {
      // setShowSwitch({show: true, onClick:  () => {switchPlianChain('toChild')}, text: 'Switch to Plian-L2 Wallet'})
      switchPlianChain('toChild')
      return
    }

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)
    // setShowLoading(true)
    setShowWaiting(true)

    const withdrawbalance = withdrawAmount

    console.log(withdrawbalance, web3.utils.toWei(withdrawbalance, 'ether'))

    MyContract.methods
      .WithdrawFromChildChain('child_0')
      .send({
        from: address,
        chainId: 'child_0',
        value: web3.utils.toWei(withdrawbalance, 'ether'),
        gas: gasl2,
        gasPrice: gasPricel2
      })
      .then(receipt => {
        message.success('Success!')
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
                      // setShowLoading(false)
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
                      // setShowLoading(false)
                      setShowError(true)
                      setShowWaiting(false)
                    }
                  })
                  .catch(err => {
                    // message.error(err.message)
                    // setShowLoading(false)
                    console.log(err.message)
                    setShowError(true)
                    setShowWaiting(false)
                  })
              } else {
                message.error('please waiting')
              }
            })
            .catch(err => {
              // message.error(err.message)
              // setShowLoading(false)
              console.log(err.message)
              setShowError(true)
              setShowWaiting(false)
              clearInterval(timer)
            })
        }, 5000)
      })
      .catch(error => {
        // message.error(error.message)
        // setShowLoading(false)
        console.log(error.message)
        setShowError(true)
        setShowWaiting(false)
      })
  }

  const checkTransaction = () => {
    console.log('check')
    let timer, txId
    // web3.eth.getTransactionReceipt('0xe693395ae3bfc9b79e94bb61e68cb139b544a735cf36bbca2f676fd8f8a28b6b').then(console.log)

    if (!Object.keys(crossChainData).length) return

    if (crossChainData.type === 'withdraw' && window.ethereum.chainId !== '0x2007d4') {
      switchPlianChain()
      return
    }

    if (crossChainData.type === 'deposit' && window.ethereum.chainId !== '0x7a3038') {
      switchPlianChain('toChild')
      return
    }

    const pollingCheck = (txId) => {
      timer = setInterval(() => {
        web3.eth.getTransactionReceipt(txId ? txId : crossChainData.txId).then(res => {
          console.log(res)
          if (res && res.status) {
            clearInterval(timer)
            setShowWaiting(false)
            setShowSuccess(true)
            dispatch(
              setCrossChainData({
                crossChainData: {}
              })
            )
          } else if ( res && !res.status) {
            clearInterval(timer)
            setShowWaiting(false)
            setShowError(true)
            dispatch(
              setCrossChainData({
                crossChainData: {}
              })
            )
          }
        })
      }, 5000)
    }

    if (crossChainData.txId) {
      setShowWaiting(true)
      pollingCheck()
      return
    }

    let MyContract = new web3.eth.Contract(crossChainABI, CROSS_CONTRACCT_ADDRESS)

    setShowWaiting(true)
    
    if (crossChainData.type === 'deposit') {
      MyContract.methods
        .DepositInChildChain('child_0', crossChainData.transactionHash)
        .send({
          from: userAddress,
          chainId: 'child_0',
          gas: gasl2,
          gasPrice: '0'
        })
        .on('transactionHash', function(hash){
          console.log(hash)
          txId = hash
          dispatch(
            setCrossChainData({
              crossChainData: {
                ...crossChainData,
                txId: hash
              }
            })
          )
        })
        .on('receipt', function(receipt){
          console.log(receipt)
          message.success('Success!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          // setShowLoading(false)
          setShowSuccess(true)
          setShowWaiting(false)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber)
        })
        .on('error', function(error, receipt) {
          console.log(error)
          // const successMsg = 'Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!'
          if(error.message.indexOf('50 blocks')>-1){
              // setShowSuccess(true)
            pollingCheck(txId)
          } else {
            setShowError(true)
            setShowWaiting(false)
          }
        })
    } else if (crossChainData.type === 'withdraw') {
      MyContract.methods
        .WithdrawFromMainChain(
          'child_0',
          web3.utils.toWei(crossChainData.balance, 'ether'),
          crossChainData.transactionHash
        )
        .send({
          from: userAddress,
          chainId: 'pchain',
          gas: gasl2,
          gasPrice: '0'
        })
        .on('transactionHash', function(hash){
          console.log(hash)
          txId = hash
          dispatch(
            setCrossChainData({
              crossChainData: {
                ...crossChainData,
                txId: hash
              }
            })
          )
        })
        .on('receipt', function(receipt){
          console.log(receipt)
          message.success('Success!')
          dispatch(
            setCrossChainData({
              crossChainData: {}
            })
          )
          // setShowLoading(false)
          setShowSuccess(true)
          setShowWaiting(false)
        })
        .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber)
        })
        .on('error', function(error, receipt) {
          console.log(error)
          // const successMsg = 'Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!'
          if(error.message.indexOf('50 blocks')>-1){
            // setShowSuccess(true)
            pollingCheck(txId)
          } else {
            setShowError(true)
            setShowWaiting(false)
          }
        })
    }
  }

  const switchPlianChain = async type => {
    const { ethereum } = window
    try {
      const flag = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ type === 'toChild' ? TESTNET_CHILD : TESTNET_MAIN ]
      })
      console.log(flag)
      return flag
    } catch (switchError) {
      console.log(switchError)
      message.error(switchError.message)
    }
  }

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  const switchTab = type => {
    if (type === 'deposit' && window.ethereum.chainId !== '0x2007d4') {
      // setShowSwitch({show: true, onClick:  () => {switchPlianChain()}, text: 'Switch to Plian-L1 Wallet'})
      switchPlianChain()
      return
    }

    if (type === 'withdraw' && window.ethereum.chainId !== '0x7a3038') {
      // setShowSwitch({show: true, onClick:  () => {switchPlianChain('toChild')}, text: 'Switch to Plian-L2 Wallet'})
      switchPlianChain('toChild')
      return
    }


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
        : history.replace({ pathname: '/l2wallet', search: 'withdraw' })
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
      <div className="l2-wallet-tip">
        Tip: Please withdraw the assets of the L2 account to the L1 account first, and then transfer to the external exchange. If the assets of the L2 account are directly transferred to an external exchange, the assets may be lost, and the platform will not be responsible for such problems.
      </div>
      <SwitchNetwork show={showSwitch.show} onClick={showSwitch.onClick} text={showSwitch.text} onClose={() => {setShowSwitch({...showSwitch, show: false})}}></SwitchNetwork>
      <SmallModal show={showWaiting}>
        <div className="waiting-modal flex flex-col	items-center">
          <div className="title">Confirm Swap</div>
          <div className="img-wrap flex items-center justify-center">
            <img src={pizza} className="pizza" alt="" />
            <img src={arrow} className="arrow" alt="" />
            <img src={wallet} className="wallet" alt="" />
          </div>
          <Spin size="large" />
          <div className="desc">Waiting For Confirmation</div>
          <div className="warn text-center">Confirm this transaction in your wallet.<br /><span className="red">Please note Metamask's signature!</span></div>
        </div>
      </SmallModal>
      <SmallModal show={showError}>
        <div className="error-modal flex flex-col	items-center">
          <div className="title">Confirm Swap</div>
          <img src={warn} alt="" className="img-warn" />
          <div className="desc">Transaction rejected.</div>
          <Button onClick={()=>setShowError(false)}>Dismiss</Button>
        </div>
      </SmallModal>
      <SmallModal show={showSuccess}>
        <div className="success-modal flex flex-col	items-center">
          <div className="title">Confirm Swap</div>
          <img src={hand} alt="" className="img-hand" />
          <div className="desc text-center">Transaction Submitted</div>
          <Button onClick={()=>setShowSuccess(false)}>Close</Button>
        </div>
      </SmallModal>
    </div>
  )
}

export default Index
