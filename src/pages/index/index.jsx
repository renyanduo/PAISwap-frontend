import React, { useState, useEffect } from 'react'
import './index.scss'
import Button from '@/components/Button'
import ConnectWallet from '@/components/ConnectWallet'
import Web3 from 'web3'
import { ABI, LPTokenABI, LPStakingABI, ERC20ABI, PNFT_CONTRACT_ADDRESS, MAPI_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, LP_CONTRACT_ADDRESS1, LPSTAKING_CONTRACT_ADDRESS1, gas, gasPrice } from '@/util/abi'
import { message, Carousel } from 'antd'
import { useSelector } from 'react-redux'
import { numFormat } from '@/util'
import Loading from '@/components/loading'
import SwitchNetwork from '@/components/SwitchNetwork'
import { MAINNET_MAIN, MAINNET_CHILD, TESTNET_MAIN, TESTNET_CHILD } from '@/util/config'
import { formatEther, parseEther, formatUnits } from '@ethersproject/units'

import banner from '@/assets/images/banner.png'
import banner2 from '@/assets/images/banner2.jpg'

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
  const [stakingAmount, setStakingAmount] = useState(0)
  const [pendingReward, setPendingReward] = useState(0) // 挖矿赚取
  const [balance, setBalance] = useState(0) // 钱包余额
  const [extractAmount, setExtractAmount] = useState('') // 提取
  const [showLoading, setShowLoading] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)
  //lp
  const [totalSupplyLP1, setTotalSupplyLP1] = useState(0)
  const [totalBalanceLP1, setTotalBalanceLP1] = useState(0)
  const [pendingRewardLP1, setPendingRewardLP1] = useState(0) // 挖矿赚取
  const [stakingAmountLP1, setStakingAmountLP1] = useState(0)
  const [balanceLP1, setBalanceLP1] = useState(0) // LP余额
  const [activeTabLP1, setActiveTabLP1] = useState('deposit')
  const [showModalLP1, setShowModalLP1] = React.useState(false)
  const [depositAmountLP1, setDepositAmountLP1] = useState('')
  const [extractAmountLP1, setExtractAmountLP1] = useState('') // 提取
  const [allowanceLP1, setAllowanceLP1] = useState('')

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
        message.success('Success!')
        setShowModal(false)
        setShowLoading(false)
        getStaking()
        getTotalBalance()
      })
      .catch(error => {
        if(error.message.indexOf('50 blocks')>-1){
          message.success('Success!')
          getStaking()
          getTotalBalance()
        }
        // message.error(error.message)
        setShowModal(false)
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
      // .catch(err => message.error(err.message))
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
      // .catch(err => message.error(err.message))
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
        message.success('Success!')
        setShowModal(false)
        setShowLoading(false)
        getStaking()
        getTotalBalance()
      })
      .catch(error => {
        if(error.message.indexOf('50 blocks')>-1){
          message.success('Success!')
          getStaking()
          getTotalBalance()
        }else {
          message.error(error.message)
        }
        setShowModal(false)
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
      // .catch(err => message.error(err.message))
  }

  
  // 待挖取
  const getTotalBalance = () => {
    let MyContract = new web3.eth.Contract(LPTokenABI, PNFT_CONTRACT_ADDRESS)
    MyContract.methods
      .balanceOf(PISTAKING_CONTRACT_ADDRESS)
      .call()
      .then(result => {
        setTotalBalance(web3.utils.fromWei(result))
        console.log('total', web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
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


  // LP 
  // 质押总量
  const getTotalSupplyLP1 = () => {
    let MyContract = new web3.eth.Contract(LPStakingABI, LPSTAKING_CONTRACT_ADDRESS1)
    MyContract.methods
      .getTotalSupply()
      .call()
      .then(function (result) {
        console.log("lp",web3.utils.fromWei(result))
        setTotalSupplyLP1(web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

  // 待挖取
  const getTotalBalanceLP1 = () => {
    let MyContract = new web3.eth.Contract(ERC20ABI, MAPI_CONTRACT_ADDRESS)
    MyContract.methods
      .balanceOf(LPSTAKING_CONTRACT_ADDRESS1)
      .call()
      .then(result => {
        setTotalBalanceLP1(web3.utils.fromWei(result))
        console.log('total', web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

  const getPendingRewardLP1 = () => {
    let MyContract = new web3.eth.Contract(LPStakingABI, LPSTAKING_CONTRACT_ADDRESS1)
    MyContract.methods
      .pendingReward(address)
      .call()
      .then(function (result) {
        setPendingRewardLP1(web3.utils.fromWei(result))
        console.log('pending', web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

    // 质押LP
  const getStakingAmountLP1 = () => {
    let MyContract = new web3.eth.Contract(LPStakingABI, LPSTAKING_CONTRACT_ADDRESS1)
    MyContract.methods
      .getStaking(address)
      .call()
      .then(function (result) {
        setStakingAmountLP1(web3.utils.fromWei(result))
        setExtractAmount(web3.utils.fromWei(result))
        console.log('staking', web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

  // LP余额
  const getBalanceLP1 = async () => {
    let MyContract = new web3.eth.Contract(LPTokenABI, LP_CONTRACT_ADDRESS1)
    MyContract.methods
      .balanceOf(address)
      .call()
      .then(function (result) {
        setBalanceLP1(web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

  // Allowance
  const getAllowanceLP1 = async () => {
    let MyContract = new web3.eth.Contract(LPTokenABI, LP_CONTRACT_ADDRESS1)
    MyContract.methods
      .allowance(address, LPSTAKING_CONTRACT_ADDRESS1)
      .call()
      .then(function (result) {
        setAllowanceLP1(web3.utils.fromWei(result))
      })
      // .catch(err => message.error(err.message))
  }

    // 质押
  const depositLP1 = () => {
    if (+depositAmountLP1 > +balanceLP1 || !depositAmountLP1 || +depositAmountLP1 <= 0) {
      message.error('invalid input')
      return
    }
    if (allowanceLP1 <= 0) {
      onApprove()
    }

    setShowLoading(true)

    let MyContract = new web3.eth.Contract(LPStakingABI, LPSTAKING_CONTRACT_ADDRESS1)

    const balance_ = depositAmountLP1.toString()

    console.log(balance_, web3.utils.toWei(balance_, 'ether'))

    MyContract.methods
      .deposit(parseEther(balance_))
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice,
        value: 0
      })
      .then(receipt => {
        message.success('Success!')
        setShowModalLP1(false)
        setShowLoading(false)
        getStakingAmountLP1()
        getTotalBalanceLP1()
      })
      .catch(error => {
        if(error.message.indexOf('50 blocks')>-1){
          message.success('Success!')
          getStakingAmountLP1()
          getTotalBalanceLP1()
        }
        // message.error(error.message)
        setShowModalLP1(false)
        setShowLoading(false)
      })
  }

  const withdrawLP1 = () => {
    if (+extractAmountLP1 > +stakingAmountLP1 || !extractAmountLP1 || +extractAmountLP1 < 0) {
      message.error('invalid input')
      return
    }

    setShowLoading(true)

    let MyContract = new web3.eth.Contract(LPStakingABI, LPSTAKING_CONTRACT_ADDRESS1)

    const balance = extractAmount.toString()

    console.log(balance, web3.utils.toWei(balance, 'ether'))

    MyContract.methods
      .withdraw(parseEther(balance))
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice
      })
      .then(receipt => {
        message.success('Success!')
        setShowModalLP1(false)
        setShowLoading(false)
        getStakingAmountLP1()
        getTotalBalanceLP1()
      })
      .catch(error => {
        if(error.message.indexOf('50 blocks')>-1){
          message.success('Success!')
          getStakingAmountLP1()
          getTotalBalanceLP1()
        }else {
          message.error(error.message)
        }
        setShowModalLP1(false)
        setShowLoading(false)
      })
  }

  const onApprove = () => {
    let MyContract = new web3.eth.Contract(LPTokenABI, LP_CONTRACT_ADDRESS1)

    MyContract.methods
      .approve(LPSTAKING_CONTRACT_ADDRESS1,'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send({
        from: address,
        gas: gas,
        gasPrice: gasPrice,
        value: 0
      })
      .then(receipt => {
        message.success('Success!')
        setAllowanceLP1(Number('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'))
        setShowLoading(false)
      })
      .catch(error => {
        if(error.message.indexOf('50 blocks')>-1){
          message.success('Success!')
          setAllowanceLP1(0)
        }
        // message.error(error.message)
        setShowLoading(false)
      })
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
  const depositClickLP1 = tab => {
    if (!checkAddress()) {
      message.error('please connect wallet')
      return
    }
    setShowModalLP1(true)
    setActiveTabLP1(tab)
    getPendingRewardLP1()
    getBalanceLP1()
    getAllowanceLP1()

  }

  const switchPlianChain = async type => {
    const { ethereum } = window
    try {
      const flag = await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [ type === 'toChild' ? MAINNET_CHILD : MAINNET_MAIN ]
      })
      console.log(flag)
      return flag
    } catch (switchError) {
      console.log(switchError)
      message.error(switchError.message)
    }
  }

   const switchPlianTestChain = async type => {
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

  const checkChainId = async() => {
    const { ethereum } = window
    return await ethereum.request({ method: 'eth_chainId' })
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
    // if (window.ethereum.chainId === '0x999d4b') {
    let timer
    checkChainId().then(res => {
      if (res === '0x999d4b') {
        function init() {
          address && getStaking()
          address && getPendingReward()
          getTotalBalance()
          getTotalSupply()
        }
        function initlp1() {
          address && getStakingAmountLP1()
          getTotalBalanceLP1()
          getTotalSupplyLP1()
          address && getPendingRewardLP1()
        }
        init()
        initlp1()
        clearInterval(timer)
        timer = setInterval(()=>{init()}, 5000)
      } else {
        // address && message.error('wrong chain id')
        setShowSwitch(true)
      }
      // address && getStaking()
      
      // if (res === '0x999d4b') {
      //   function init() {
      //     address && getPendingReward()
      //     getTotalBalance()
      //     getTotalSupply()
      //   }
      //   function initlp1() {
      //     address && getStakingAmountLP1()
      //     getTotalBalanceLP1()
      //     getTotalSupplyLP1()
      //     address && getPendingRewardLP1()
      //   }
      //   init()
      //   clearInterval(timer)
      //   timer = setInterval(()=>{init()}, 5000)
      // } else {
      //   // address && message.error('wrong chain id')
      //   setShowSwitch(true)
      // }
    })
    return () => {
      clearInterval(timer)
    };
  }, [address])

  const modal = (
    <div className="modals">
      <div className="modals-close" onClick={() => setShowModal(false)}>
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
          <div className="modals-cell">
            <div className="modals-title">Stake amount</div>
          </div>
          <div className="modals-input">
            <div className="modals-input-max" onClick={() => setDepositAmount(balance.toString())}>
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
          <div className="modals-cell">
            <div className="modals-title">Balance available</div>
            <div className="modals-amount">{numFormat(balance)} PI</div>
          </div>
          <Button className="submit" onClick={deposit}>
            Stake
          </Button>
        </>
      ) : null}

     

      {activeTab === 'extract' ? (
        <>
          <div className="modals-cell">
            <div className="modals-title">Staked</div>
          </div>
          <div className="modals-input">
            <input
              type="number"
              value={extractAmount}
              onChange={e => setExtractAmount(e.target.value)}
              placeholder={`Max: ${stakingAmount}`}
            />
            <div>PI</div>
          </div>
          <div className="modals-cell">
            <div className="modals-title">Earned</div>
          </div>
          <div className="modals-input">
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
  const modalLP1 = (
    <div className="modals">
      <div className="modals-close" onClick={() => setShowModalLP1(false)}>
        &times;
      </div>
      <div className="tab">

        <div
          className={`tab-item ${activeTabLP1 === 'depositlp1' ? 'active' : ''}`}
          onClick={() => setActiveTabLP1('depositlp1')}>
          Stake
        </div>

        <div
          className={`tab-item ${activeTabLP1 === 'extractlp1' ? 'active' : ''}`}
          onClick={() => setActiveTabLP1('extractlp1')}>
          Harvest
        </div>
       
      </div>

      {activeTabLP1 === 'depositlp1' ? (
        <>
          <div className="modals-cell">
            <div className="modals-title">Stake amount</div>
          </div>
          <div className="modals-input">
            <div className="modals-input-max" onClick={() => setDepositAmountLP1(balanceLP1.toString())}>
              MAX
            </div>
            <input
              type="number"
              onChange={e => setDepositAmountLP1(e.target.value)}
              value={depositAmountLP1}
              placeholder="Please enter the number"
            />
            <div>LP</div>
          </div>
          <div className="modals-cell">
            <div className="modals-title">Balance available</div>
            <div className="modals-amount">{numFormat(balanceLP1)} LP</div>
          </div>
          <Button className="submit" onClick={depositLP1}>
            Stake
          </Button>
        </>
      ) : null}

  
      {activeTabLP1 === 'extractlp1' ? (
        <>
          <div className="modals-cell">
            <div className="modals-title">Staked</div>
          </div>
          <div className="modals-input">
            <input
              type="number"
              value={extractAmountLP1}
              onChange={e => setExtractAmountLP1(e.target.value)}
              placeholder={`Max: ${stakingAmountLP1}`}
            />
            <div>LP</div>
          </div>
          <div className="modals-cell">
            <div className="modals-title">Earned</div>
          </div>
          <div className="modals-input">
            <input value={pendingRewardLP1} readOnly />
            <div>MAPI</div>
          </div>
          <Button className="submit" onClick={withdrawLP1}>
            Unstake & harvest
          </Button>
        </>
      ) : null}
    </div>
  )

  return (
    <div className="main">
      <div className="banner">
      <Carousel autoplay effect="fade">
        <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
          <img src={banner} alt="" />
        </a>
        {/*<a href="#" rel="noopener noreferrer">*/}
        {/*  <img src={banner2} alt="" />*/}
        {/*</a>*/}
      </Carousel>
      </div>
      {userAddress ? (
        <>
          <div className="flex flex-wrap content sm:flex-nowrap">
            <div className="items-center w-full mr-0 box sm:mr-14 sm:w-1/2 justify-evenly">
              <div className="box-title">Total PI staked</div>
              <div className="box-amount">{numFormat(totalSupply)} $PI</div>
              <div className="box-highlight">PNFT mining reward (Total undistributed)</div>
              <div className="box-amount">{numFormat(totalBalance)} $PNFT</div>
            </div>
            <div className="items-center justify-between w-full box sm:w-1/2">
              <div className="box-title">PI staked</div>
              <div className="box-amount">{numFormat(stakingAmount)} $PI</div>
              <Button onClick={() => depositClick('deposit')} style={{ height: '42px' }}>
                Stake
              </Button>
              <div className="box-title">PNFT to be earned</div>
              <div className="box-amount">{numFormat(pendingReward)} $PNFT</div>
              <Button onClick={() => depositClick('extract')} style={{ height: '42px' }}>
                Harvest
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap content sm:flex-nowrap">
            <div className="items-center w-full mr-0 box sm:mr-14 sm:w-1/2 justify-evenly">
              <div className="box-title">Total PI/PNFT-LP staked</div>
              <div className="box-amount">{numFormat(totalSupplyLP1)} PI/PNFT-LP</div>
              <div className="box-highlight">MAPI mining reward (Total undistributed)</div>
              <div className="box-amount">{numFormat(totalBalanceLP1)} $MAPI</div>
            </div>
            <div className="items-center justify-between w-full box sm:w-1/2">
              <div className="box-title">PI/PNFT-LP staked</div>
              <div className="box-amount">{numFormat(stakingAmountLP1)} PI/PNFT-LP</div>
              <Button onClick={() => depositClickLP1('depositlp1')} style={{ height: '42px' }}>
                Stake
              </Button>
              <div className="box-title">MAPI to be earned</div>
              <div className="box-amount">{numFormat(pendingRewardLP1)} $MAPI</div>
              <Button onClick={() => depositClickLP1('extractlp1')} style={{ height: '42px' }}>
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
      {showModalLP1 ? modalLP1 : null}
      <Loading show={showLoading} />
      <SwitchNetwork show={showSwitch} onClick={()=>{switchPlianTestChain('toPlianTestChild')}} text="Switch to Plian Test Child" desc="Test.Paiswap is running on Plian Test child chain, you should switch your current network to Plian Test child."></SwitchNetwork>
    </div>
  )
}

export default Index
