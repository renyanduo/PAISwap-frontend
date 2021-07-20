import React from 'react'
import { Modal } from '@pancakeswap-libs/uikit'

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const PledgeModal = ({ onDismiss = defaultOnDismiss }) => {
  console.log(1111)
  return (
    <Modal title="333" onDismiss={onDismiss}>
      <div>dfjsiof</div>
    </Modal>
  )
}

export default PledgeModal
