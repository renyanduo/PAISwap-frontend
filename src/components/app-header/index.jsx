import React, { useEffect } from 'react'
import './index.scss'
import Button from '@/components/ConnectButton'
import ConnectWallet from '@/components/ConnectWallet'
import logo from '@/assets/images/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { setUserAddress } from '@/store/action'

function Index(props) {
  const userAddress = useSelector(state => state.address)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  function jump(route) {
    history.push(route)
  }

  // useEffect(() => {
  //   dispatch(
  //     setUserAddress({
  //       address: window.ethereum.selectedAddress || ''
  //     })
  //   )
  // }, [])

  window.ethereum && window.ethereum.on('chainChanged', _chainId => window.location.reload())

  window.ethereum &&
    window.ethereum.on('accountsChanged', accounts => {
      console.log(accounts)
      dispatch(
        setUserAddress({
          address: accounts[0]
        })
      )
    })

  return (
    <header className="header flex items-center">
      <div className="header-wrap flex justify-between items-center flex-wrap sm:flex-nowrap">
        <img src={logo} alt="piswap" className="logo" />
        <div className="header-title">
          <span
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => {
              jump('/')
            }}>
            HOME
          </span>
          <span
            className={location.pathname === '/l2wallet' ? 'active' : ''}
            onClick={() => {
              jump('/l2wallet?deposit')
            }}>
            L2 WALLET
          </span>
          <span
            className={location.pathname === '/swap' ? 'active' : ''}
            onClick={() => {
              jump('/swap')
            }}>
            SWAP
          </span>
          <span
            className={location.pathname === '/pool' ? 'active' : ''}
            onClick={() => {
              jump('/pool')
            }}>
            POOL
          </span>
        </div>
        <div className="mt-4 sm:mt-0">
          <ConnectWallet>
            <Button>{userAddress ? userAddress : 'Connect Wallet'}</Button>
          </ConnectWallet>
        </div>
      </div>
    </header>
  )
}

export default Index
