import React from 'react'

const {document} = global

export function ChessboardPiece({name, component} : {name: string, component: React.ComponentClass|React.FC}) {
  const customEvent = new CustomEvent('ChessboardLoaded::' + name, {detail: {component}})
  document.dispatchEvent(customEvent)

  return ({
    reload(Component: React.ComponentClass|React.FC) {
      const customEvent = new CustomEvent('ChessboardLoaded::' + name, {detail: {component: Component}})
      document.dispatchEvent(customEvent)
    }
  })
}
