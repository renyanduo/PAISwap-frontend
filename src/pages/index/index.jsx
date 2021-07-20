import React from 'react'
import './index.scss'
import { Text, useModal, Button, Modal } from '@pancakeswap-libs/uikit'
import { ThemeContext } from 'styled-components'
import PledgeModal from '@/components/PledgeModal'

import banner from '@/assets/images/banner.png'

const Index = () => {

  const modal = (
    <div className="modal">
      <div className="tab">
        <div className="tab-item active">质押</div>
        <div className="tab-item">提取</div>
      </div>
      <div>
        质押数量
      </div>
      <div>
        <div>钱包余额</div>
        <div>1.99 PI</div>
      </div>
      <Button>质押</Button>
    </div>
  )

  const [onPresent] = useModal(<PledgeModal />)

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" />
      </div>
      <Button onClick={onPresent}>aaa</Button>

      <div className="content">
        <div className="box">
          <Text fontSize="38px">当前全网质押总量为</Text>
          <div>8,996,798,492.726 PI</div>
          <div>待挖取PNFT数量</div>
          <div>1,000,000</div>
        </div>
        <div className="box">
          <div>质押Pi</div>
          <div>1,000,000</div>
          <div>挖矿赚取PNFT</div>
          <div>1,000,000</div>
        </div>
      </div>
      {modal}
    </>
  )
}

export default Index
