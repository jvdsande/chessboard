import React from 'react'
import ReactDOM from 'react-dom'

import {ChessboardSquare, ChessboardProvider} from '@chessboard/client'

import pieces from './chessboard-pieces.json'

const App = () => {
  const [value, setValue] = React.useState('Hello')
  const onChange = React.useCallback((e) => setValue(e.target.value), [])

  return (
    <ChessboardProvider pieces={pieces}>
      <ChessboardSquare name="FirstPiece" props={{title: 'Microfrontends', value, onChange}}/>
      <ChessboardSquare name="SecondPiece" props={{title: 'Rocks!', value}}/>
    </ChessboardProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)

