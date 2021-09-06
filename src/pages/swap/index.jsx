import React, { useEffect, useState } from 'react'

export default function Index() {
  const [iFrameHeight, setIFrameHeight] = useState('0px')
  let timer

  useEffect(()=> {
    return () => {
      clearInterval(timer)
    }
  },[timer])

  return (
    <div className="main">
      <iframe
        id="iframe"
        style={{ width: '100%', height: iFrameHeight, overflow: 'visible' }}
        onLoad={() => {
          const obj = document.getElementById('iframe')
          timer = setInterval(() => {
            setIFrameHeight(obj.contentWindow.document.body.scrollHeight + 'px')
          }, 1000)
        }}
        title="swap"
        src="/liquidity"
        frameBorder="0"
        width="100%"
        height={iFrameHeight}></iframe>
    </div>
  )
}
