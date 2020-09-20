import React from 'react'
import ReactDOM from 'react-dom'

import {ChessboardSquare, ChessboardProvider} from '@chessboard/board'

import Meta from '../components/Meta'

import pieces from './chessboard-pieces.json'

const App = () => {
  const [value, setValue] = React.useState('Hello')
  const onChange = React.useCallback((e) => setValue(e.target.value), [])

  return (
    <ChessboardProvider pieces={pieces}>
      <Meta />
      <ChessboardSquare name="FirstPiece" props={{title: 'Microfrontends', value, onChange}}/>
      <ChessboardSquare name="SecondPiece" props={{title: 'Rocks!', value}}/>
    </ChessboardProvider>
  )
}

export default App

