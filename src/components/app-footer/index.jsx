import React from 'react'
import './index.scss'
import github from '@/assets/images/github.png'
import twitter from '@/assets/images/twitter.png'
import telegram from '@/assets/images/telegram.png'

function Index(props) {
  return (
    <footer className="footer">
      <div className="footer-item">
        <img src={github} alt="github" />
      </div>
      <div className="footer-item">
        <img src={twitter} alt="twitter" />
      </div>
      <div className="footer-item">
        <img src={telegram} alt="telegram" />
      </div>
    </footer>
  )
}

export default Index
