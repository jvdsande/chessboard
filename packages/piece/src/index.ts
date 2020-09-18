import React from 'react'

const {document} = global

function load(component: React.ComponentClass|React.FC) {
  console.log('ChessboardLoaded::' + process.env.CHESSBOARD_PIECE)
  const customEvent = new CustomEvent('ChessboardLoaded::' + process.env.CHESSBOARD_PIECE, {detail: {component}})
  document.dispatchEvent(customEvent)
}

export function ChessboardPiece(component: React.ComponentClass|React.FC) {
  load(component)

  return ({ reload: load })
}
