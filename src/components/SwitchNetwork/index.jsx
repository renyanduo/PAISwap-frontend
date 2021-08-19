import React from 'react'
import SmallModal from '../SmallModal'
import './index.scss'

import pizza from '@/assets/images/pizza2.png'

function Index(props) {
  return (
    <SmallModal show={props.show}>
      <div className="switch-modal flex flex-col items-center">
        <div className="title">Switch Network</div>
        <div className="switch-btn flex items-center justify-center" onClick={props.onClick}><img src={pizza} alt="" />{ props.text }</div>
        <div className="desc">{ props.desc }</div>
        {props.onClose ? <div className="close" onClick={props.onClose}>&times;</div> : null}
      </div>
    </SmallModal>
  )
}

export default Index
