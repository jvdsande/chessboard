import React from 'react'
import ReactDOM from 'react-dom'

export function ChessboardExternals(externals: {[key: string]: any} = {}) {
  if(typeof window !== 'undefined') {
    window.React = React
    window.ReactDOM = ReactDOM

    Object.keys(externals)
      .forEach((e) => {
        window[e as any] = externals[e]
      })
  }
}
