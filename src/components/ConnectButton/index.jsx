import React from 'react'
import './index.scss'

function Index(props) {
  return (
    <div
      className={`connect-button ${props.className}`}
      onClick={props.onClick}
      style={props.style}>
      <span>{props.children}</span>
      <div className="connect-button-dot"></div>
    </div>
  )
}

export default Index
