import React, { useEffect, useState } from 'react'
import Loading from '@/components/loading'

export default function Index() {
  const [iFrameHeight, setIFrameHeight] = useState('0px')
  const [showLoading, setShowLoading] = useState(true)
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
          setShowLoading(false)
          const obj = document.getElementById('iframe')
          timer = setInterval(() => {
            if (!obj || !obj.contentWindow) {
              clearInterval(timer)
            } else {
              setIFrameHeight(obj.contentWindow.document.body.scrollHeight + 'px')
            }
          }, 200)
        }}
        title="swap"
        src="/liquidity"
        frameBorder="0"
        width="100%"></iframe>
      <Loading show={showLoading} />
    </div>
  )
}
