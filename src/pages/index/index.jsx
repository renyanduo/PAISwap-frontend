import React, { useState } from 'react'
import './index.scss'
import { ThemeContext } from 'styled-components'
import Button from '@/components/Button'

import banner from '@/assets/images/banner.png'

const Index = () => {
  const [activeTab, setActiveTab] = useState('pledge')
  const [pledgeAmount, setPledgeAmount] = useState('')
  const [showModal, setShowModal] = React.useState(false)

  const modal = (
    <div className="modal">
      <div className="modal-close" onClick={() => setShowModal(false)}>
        &times;
      </div>
      <div className="tab">
        <div
          className={`tab-item ${activeTab === 'pledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('pledge')}>
          质押
        </div>
        <div
          className={`tab-item ${activeTab === 'extract' ? 'active' : ''}`}
          onClick={() => setActiveTab('extract')}>
          提取
        </div>
      </div>
      {activeTab === 'pledge' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">质押数量</div>
          </div>
          <div className="modal-input">
            <div className="modal-input-max">MAX</div>
            <input type="number" onChange={e => setPledgeAmount(e.target.value)} />
            <div>Pi</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">钱包余额</div>
            <div className="modal-amount">1.99 PI</div>
          </div>
          <Button className="submit">质押</Button>
        </>
      ) : null}

      {activeTab === 'extract' ? (
        <>
          <div className="modal-cell">
            <div className="modal-title">已质押</div>
          </div>
          <div className="modal-input">
            <input type="number" />
            <div>Pi</div>
          </div>
          <div className="modal-cell">
            <div className="modal-title">挖矿赚取</div>
          </div>
          <div className="modal-input">
            <input type="number" />
            <div>PNFT</div>
          </div>
          <Button className="submit">提取</Button>
        </>
      ) : null}
    </div>
  )

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" />
      </div>

      <div className="content">
        <div className="box">
          <div className="box-title">当前全网质押总量为</div>
          <div className="box-amount">8,798,492.726 PI</div>
          <div className="box-highlight">待挖取PNFT数量</div>
          <div className="box-amount">1,000,000</div>
        </div>
        <div className="box">
          <div className="box-title">质押Pi</div>
          <div className="box-amount">
            <div>0.00</div>
            <Button>质押</Button>
          </div>
          <div className="box-title">挖矿赚取PNFT</div>
          <div className="box-amount">
            <div>0.00</div>
            <Button>提取</Button>
          </div>
        </div>
      </div>
      {showModal ? modal : null}
    </>
  )
}

export default Index
