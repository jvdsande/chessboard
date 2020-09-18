import { ChessboardPiece } from '@chessboard/piece'

import App from './app/app'

const piece = ChessboardPiece(App)

if(module.hot) {
  module.hot.accept('./app/app', () => {
    const NextApp = require('./app/app').default
    piece.reload(NextApp)
  })
}
