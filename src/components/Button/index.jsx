import React from 'react'
import './index.scss'

function Index(props) {
  return <div className={`p-button ${props.className ? props.className : ''}`} onClick={props.onClick} style={props.style}>{ props.children }</div>
}

export default Index
