import React from 'react'
import './index.scss'

function Index(props) {
  return props.show ? (
    <div className={`small-modal ${props.className ? props.className : ''}`} style={props.style}>
      {props.children}
    </div>
  ) : null
}

export default Index
