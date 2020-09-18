import React from 'react'
import ReactDOM from 'react-dom'

import App from './app/app'

const render = (Component) => {
  ReactDOM.render(
    <React.StrictMode>
      <Component title="Development" />
    </React.StrictMode>,
    window.app,
  )
}

document.addEventListener('DOMContentLoaded', () => render(App))

if(module.hot) {
  module.hot.accept('./app/app', () => {
    const NextApp = require('./app/app').default

    render(NextApp)
  })
}
