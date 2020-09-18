import React from 'react'

const {document} = global

function load(component: React.ComponentClass|React.FC) {
  const customEvent = new CustomEvent('ChessboardLoaded::' + process.env.CHESSBOARD_PIECE, {detail: {component}})
  document.dispatchEvent(customEvent)
}

export function ChessboardPiece(component: React.ComponentClass|React.FC) {
  const listener = () => load(component)
  document.addEventListener('ChessboardNeeded::' + process.env.CHESSBOARD_PIECE, listener)

  listener()

  return ({
    reload: (c: React.ComponentClass|React.FC) => {
      document.removeEventListener('ChessboardNeeded::' + process.env.CHESSBOARD_PIECE, listener)

      // Wrap in setTimeout to avoid Stack Overflow
      setTimeout(() => ChessboardPiece(c), 0)
    }
  })
}
