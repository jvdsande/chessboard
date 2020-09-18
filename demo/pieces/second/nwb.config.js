const { ChessboardNwb } = require('@chessboard/nwb-config')

module.exports = ChessboardNwb(
  {
    name: 'SecondPiece',
    port: 3002,
    publicUrl: 'http://localhost:3002/'
  }
)
