import React from 'react'
import './index.scss'
import { Text, useModal, Button, Modal } from '@pancakeswap-libs/uikit'
import { ThemeContext } from 'styled-components'
import PledgeModal from '@/components/PledgeModal'

import banner from '@/assets/images/banner.png'

const Index = () => {

  const BackButtonModal = ({ title, onDismiss }) => {
    const handleOnBack = () => {
      return 1
    }

    return (
      <Modal title={title} onDismiss={onDismiss} onBack={handleOnBack} hideCloseButton>
        <Button onClick={onDismiss} variant="text">
          Consumer can still close it.
        </Button>
      </Modal>
    )
  }
  const [onPresent1] = useModal(<BackButtonModal title="Modal with no X" />, false);

  const [onPresent] = useModal(<PledgeModal />)

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" />
      </div>
      <Button onClick={onPresent}>aaa</Button>
      <Button onClick={onPresent1}>Only Back Button</Button>
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
    </>
  )
}

export default Index
