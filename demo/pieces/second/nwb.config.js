const { ChessboardNwb } = require('@chessboard/nwb-config')

module.exports = ChessboardNwb(
  'SecondPiece',
  {
    port: 3002,
    publicUrl: 'http://localhost:3002/'
  }
)
