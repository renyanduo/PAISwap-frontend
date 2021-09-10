import React, { useEffect, useState } from 'react'
import './index.scss'
import Button from '@/components/ConnectButton'
import ConnectWallet from '@/components/ConnectWallet'
import WalletOption from '@/components/WalletOption'
import logo from '@/assets/images/logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { setUserAddress } from '@/store/action'
import { subSplit } from '@/util'
import { Menu, Dropdown } from 'antd'
import { WalletOutlined } from '@ant-design/icons';
import burger from '@/assets/images/burger.png'



function Index(props) {
  const userAddress = useSelector(state => state.address)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)

  const isMobile = () => {
    return /(iphone|ipad|ipod|ios|android)/i.test(navigator.userAgent.toLowerCase())
  }

  function jump(route) {
    history.push(route)
    setShowMenu(false)
  }

  useEffect(() => {
    // dispatch(
    //   setUserAddress({
    //     address: window.ethereum.selectedAddress || ''
    //   })
    // )
    // if (isMobile()) {
    //   document.getElementById('root').style.display = 'none'
    //   message.error('The mobile version is temporarily unavailable, please use the desktop version')
    // }
  }, [])

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

  const nameList = {
    '/l2wallet': 'L2 WALLET',
    '/': 'HOME',
    '/swap': 'SWAP',
    '/pool': 'POOL'
  }


  const onClick = ({ key }) => {
    if (key == "logout") {
      if (window.ethereum) {
        window.ethereum['_state'] = []
        dispatch(
          setUserAddress({
            address: ''
          })
        )

      }
    }
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="logout">Disconnect Wallet</Menu.Item>
    </Menu>
  );
  return (
    <header className="flex items-center header">
      <div className="flex items-center justify-between header-wrap flex-nowrap">
        <img src={logo} alt="piswap" className="logo" />
        <>
          <div className="hidden header-title sm:block">
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
                jump('/l2wallet?withdraw')
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
          <div className="block header-title sm:hidden">{nameList[location.pathname]}</div>
        </>
        <>
          
          <div className="hidden mt-4 sm:mt-0 sm:block" id="header-right" style={{ visibility: location.pathname === '/swap' ? 'hidden' : 'visible' }}>
            <WalletOption useAddress={userAddress} >
              <a>钱包</a>
            </WalletOption>
            {userAddress ? (
              <Dropdown overlay={menu} trigger={['click']} getPopupContainer={() => document.getElementById('header-right') }>
                <Button>{subSplit(userAddress, 6, 4)}</Button>
              </Dropdown>
            ) :
              <ConnectWallet>
                <Button>Connect Wallet</Button>
              </ConnectWallet>
            }
          </div>
          <div className="block burger sm:hidden" onClick={() => setShowMenu(true)}>
            <img src={burger} alt="memu" />
          </div>
        </>
      </div>

      {showMenu && (
        <div className="block open-menu sm:hidden">
          <div className="flex items-center justify-between">
            <img src={logo} alt="piswap" className="logo" />
            <span className="close" onClick={() => setShowMenu(false)}>
              &times;
            </span>
          </div>
          <ul className="cell-list">
            <li
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => {
                jump('/')
              }}>
              HOME
            </li>
            <li
              className={location.pathname === '/l2wallet' ? 'active' : ''}
              onClick={() => {
                jump('/l2wallet?withdraw')
              }}>
              L2 WALLET
            </li>
            <li
              className={location.pathname === '/swap' ? 'active' : ''}
              onClick={() => {
                jump('/swap')
              }}>
              SWAP
            </li>
            <li
              className={location.pathname === '/pool' ? 'active' : ''}
              onClick={() => {
                jump('/pool')
              }}>
              POOL
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Index
