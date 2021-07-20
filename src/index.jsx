import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ThemeContextProvider } from './ThemeContext.jsx'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
// ReactDOM.render(<App />, document.getElementById('root'))
