import React, { useState, useEffect } from 'react';
import OldPortal from '../oldPortal';
import PropTypes from 'prop-types';
import './index.scss';
import Close from '@/assets/images/close.png'
import Share from '@/assets/images/share.png'
function Modal(props) {
  const { title, children, confirmDisable } = props;
  const [visibles, setVisibles] = useState(false);

  useEffect(() => {
    setVisibles(props.visible)
    return () => {
      setVisibles(false)
    }
  }, [props.visible])
  // 点击取消更新modal中的visible状态
  const closeModal = () => {
    const { onClose } = props
    onClose && onClose()
    setVisibles(false)
  }

  const confirm = () => {
    const { confirm } = props
    if (confirmDisable) {
      return
    }
    confirm && confirm()
  }

  const maskClick = () => {
    const { onClose } = props
    onClose && onClose()
    setVisibles(false)
  }

  const onApprove = () => {
    const { onApprove } = props
    onApprove && onApprove()
    setVisibles(false)
  }


  return (
    <OldPortal visible={visibles}>
      <div className="modal-wrapper">
        <div className="modal">
          <div className="close-icon">
            <img src={Close} alt="close" onClick={closeModal} />
          </div>
          {/* 这里使用父组件的title*/}
          <div className="modal-title">{title}</div>
          {/* 这里的content使用父组件的children*/}
          <div className="modal-content">{children}</div>
          <div className="modal-operator">
            {props.approve ?
              (
                <>
                  <button className="modal-operator-approve" onClick={onApprove}>Approve</button>
                </>
              ) : (
                <>
                  <button className="modal-operator-close" onClick={closeModal}>Cancel</button>
                  <button className="modal-operator-confirm" onClick={confirm} disabled={confirmDisable}>Confirm</button>
                </>
              )}
          </div>

          {props.target && (
            <div className="target">
              <a href={props.target} target="_blank" rel="noopener noreferrer">Get ETH-USDT LP</a>
              <img src={Share} alt="share" />
            </div>
          )}
        </div>
        <div className="mask" onClick={maskClick}></div>
      </div>
    </OldPortal>)
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  confirmDisable: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  approve: PropTypes.bool,
}
// Modal.defaultProps = {
//   approve: false
// }
export default Modal;