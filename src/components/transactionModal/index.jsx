import React, { useState, useEffect } from 'react';
import OldPortal from '../oldPortal';
import './index.scss';
import Button from '@/components/Button'
import SmallModal from '@/components/SmallModal'
import { Spin } from 'antd'

import { LoadingOutlined } from '@ant-design/icons';
import pizza from '@/assets/images/pizza.png'
import wallet from '@/assets/images/wallet.png'
import arrow from '@/assets/images/arrow.png'
import warn from '@/assets/images/warn.png'
import hand from '@/assets/images/hand.png'

const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;

function TransactionModal(props) {
  const { status } = props;
  const [visibles, setVisibles] = useState(false);


  useEffect(() => {
    setVisibles(props.visible)
    return () => {
      setVisibles(false)
    }
  }, [props.visible])

  const closeModal = () => {
    const { onTclose } = props
    onTclose && onTclose()
    setVisibles(false)
  }

  return (
    <OldPortal visible={visibles}>
      <div className="modal-wrapper">
        <SmallModal show={visibles}>
          { !status ? (
            <div className="flex flex-col items-center waiting-modal">
              <div className="title">Confirm Swap</div>
              <div className="flex items-center justify-center img-wrap">
                <img src={pizza} className="pizza" alt="" />
                <img src={arrow} className="arrow" alt="" />
                <img src={wallet} className="wallet" alt="" />
              </div>
              <Spin indicator={antIcon} className="spin" />
              <div className="desc">Waiting For Confirmation</div>
              <div className="text-center warn">Confirm this transaction in your wallet.<br /><span className="red">Please note Metamask's signature!</span></div>
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center success-modal">
              <div className="title">Confirm Swap</div>
              <img src={hand} alt="" className="img-hand" />
              <div className="text-center desc">Transaction Submitted</div>
              <Button onClick={() => closeModal(false)}>Close</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center error-modal">
              <div className="title">Confirm Swap</div>
              <img src={warn} alt="" className="img-warn" />
              <div className="desc">Transaction rejected.</div>
              <Button onClick={() => closeModal(false)}>Dismiss</Button>
            </div>
          )}
        </SmallModal>
      </div>
    </OldPortal >)
}
export default TransactionModal;