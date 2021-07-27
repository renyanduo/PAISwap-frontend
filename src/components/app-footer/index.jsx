import React from 'react'
import './index.scss'
import github from '@/assets/images/github.png'
import twitter from '@/assets/images/twitter.png'
import telegram from '@/assets/images/telegram.png'

function Index(props) {
  return (
    <footer className="footer">
      <img src={github} alt="github" />
      <img src={twitter} alt="twitter" />
      <img src={telegram} alt="telegram" />
    </footer>
  )
}

export default Index
