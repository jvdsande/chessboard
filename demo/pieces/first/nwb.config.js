const { ChessboardNwb } = require('@chessboard/nwb-config')

module.exports = ChessboardNwb(
  {
    name: 'FirstPiece',
    port: 3001,
    publicUrl: 'http://localhost:3001/'
  }
)
