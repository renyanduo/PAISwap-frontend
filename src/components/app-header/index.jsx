import React from 'react'
import './index.scss'
import { Box } from '@pancakeswap-libs/uikit'
import Button from '@/components/Button'
import logo from '@/assets/images/logo.png'

function Index(props) {
  return (
    <header className="header">
      <div className="header-wrap flex justify-between items-center	">
        <img src={logo} alt="piswap" className="logo" />
        <div className="header-title">
          首页
        </div>
        <div>
          <Box>
            <Button>连接钱包</Button>
          </Box>
        </div>
      </div>
    </header>
  )
}

export default Index
