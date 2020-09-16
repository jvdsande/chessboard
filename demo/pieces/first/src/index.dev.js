import React from 'react'
import ReactDOM from 'react-dom'

import App from './app/app'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <React.StrictMode>
      <App title="Development" />
    </React.StrictMode>,
    window.app,
  )
})
