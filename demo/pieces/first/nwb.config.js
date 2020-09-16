const { ChessboardNwb } = require('@chessboard/nwb-config')

module.exports = ChessboardNwb(
  'FirstPiece',
  {
    port: 3001,
    publicUrl: 'http://localhost:3001/'
  }
)
