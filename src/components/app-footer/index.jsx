import React from 'react'
import './index.scss'
import github from '@/assets/images/github.png'
import twitter from '@/assets/images/twitter.png'
import telegram from '@/assets/images/telegram.png'

function Index(props) {
  return (
    <footer className="footer">
      <div className="footer-item">
        <a href="https://pizzap.gitbook.io/pizzap/" target="_blank" rel="noopener noreferrer">
          <img src={github} alt="github" />
        </a>
      </div>
      <div className="footer-item">
        <a href="https://twitter.com/pizzap_io" target="_blank" rel="noopener noreferrer">
          <img src={twitter} alt="twitter" />
        </a>
      </div>
      <div className="footer-item">
        <a href="https://t.me/pizzap_io" target="_blank" rel="noopener noreferrer">
          <img src={telegram} alt="telegram" />
        </a>
      </div>
    </footer>
  )
}

export default Index
