import React, { useState, useEffect } from 'react';
import OldPortal from './oldPortal';
import PropTypes from 'prop-types';
import './index.scss';
import SmallModal from '@/components/SmallModal'
import pizza from '@/assets/images/pizza.png'
import wallet from '@/assets/images/wallet.png'
import arrow from '@/assets/images/arrow.png'
import { message, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function TransactionModal(props) {
  const { status } = props;
  const [visibles, setVisibles] = useState(false);

  useEffect(() => {
    setVisibles(props.visible)
    return () => {
      setVisibles(false)
    }
  }, [props.visible])


  return (
    <OldPortal visible={visibles}>
      <div className="modal-wrapper">
        <SmallModal show={visibles}>
          <div className="flex flex-col items-center waiting-modal">
            <div className="title">Confirm Swap</div>
            <div className="flex items-center justify-center img-wrap">
              <img src={pizza} className="pizza" alt="" />
              <img src={arrow} className="arrow" alt="" />
              <img src={wallet} className="wallet" alt="" />
            </div>
            <Spin indicator={antIcon} />
            <div className="desc">Waiting For Confirmation</div>
            <div className="text-center warn">Confirm this transaction in your wallet.<br /><span className="red">Please note Metamask's signature!</span></div>
          </div>
        </SmallModal>
        {/* <SmallModal show={showError}>
          <div className="flex flex-col items-center error-modal">
            <div className="title">Confirm Swap</div>
            <img src={warn} alt="" className="img-warn" />
            <div className="desc">Transaction rejected.</div>
            <Button onClick={() => setShowError(false)}>Dismiss</Button>
          </div>
        </SmallModal>
        <SmallModal show={showSuccess}>
          <div className="flex flex-col items-center success-modal">
            <div className="title">Confirm Swap</div>
            <img src={hand} alt="" className="img-hand" />
            <div className="text-center desc">Transaction Submitted</div>
            <Button onClick={() => setShowSuccess(false)}>Close</Button>
          </div>
        </SmallModal> */}
      </div>
    </OldPortal >)
}

TransactionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  status: PropTypes.string
}
export default TransactionModal;