import React from 'react'
import ReactDOM from 'react-dom'

import {ChessboardSquare} from '@chessboard/client'

const App = () => {
  const [value, setValue] = React.useState('Hello')
  const onChange = React.useCallback((e) => setValue(e.target.value), [])

  return (
    <>
      <ChessboardSquare name="FirstPiece" props={{title: 'Microfrontends', value, onChange}}/>
      <ChessboardSquare name="SecondPiece" props={{title: 'Rocks!', value}}/>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)

