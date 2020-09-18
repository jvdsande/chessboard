import React from 'react'
import { v4 } from 'uuid'

import {ChessboardExternals} from '@chessboard/externals'

const {window, document, CustomEvent} = global

ChessboardExternals()

function loadScript(host: string, name: string) {
  const [protocol, url] = host.split('://')
  const runtime = protocol + '://' + (url + '/client.js').split('/').filter(s => !!s).join('/')
  const piece =  protocol + '://' + (url + '/' + name + '.client.js').split('/').filter(s => !!s).join('/')

  if (document.querySelector('script[src="'.concat(piece, '"]'))) {
    const customEvent = new CustomEvent('ChessboardNeeded::' + name, {})
    document.dispatchEvent(customEvent)
    return
  }

  const runtimeEl = document.createElement('script')
  runtimeEl.type = 'text/javascript'
  runtimeEl.async = true
  runtimeEl.src = runtime
  document.head.appendChild(runtimeEl)

  const pieceEl = document.createElement('script')
  pieceEl.type = 'text/javascript'
  pieceEl.async = true
  pieceEl.src = piece
  document.head.appendChild(pieceEl)
}

function loadStyle(host: string, name: string) {
  const [protocol, url] = host.split('://')
  const src = protocol + '://' + (url + '/' + name + '.client.css').split('/').filter(s => !!s).join('/')

  return new Promise(function (resolve) {
    if (document.querySelector('link[href="'.concat(src, '"]'))) {
      resolve()
      return
    }

    const el = document.createElement('link')
    el.rel = 'stylesheet'
    el.href = src
    el.addEventListener('load', resolve)
    el.addEventListener('error', resolve)
    el.addEventListener('abort', resolve)
    document.head.appendChild(el)
  })
}

const ChessboardContext = React.createContext<{ pieces: Record<string, string> }>({ pieces: {} })

export function ChessboardProvider({ pieces, children } : { pieces: Record<string, string>, children: React.ReactNode }) {
  return (
    React.createElement(
      ChessboardContext.Provider,
      { value: { pieces } },
      children,
    )
  )
}

export function ChessboardSquare({name, props} : { name: string, props: any}) {
  const [id] = React.useState(() => v4())
  const [Component, setComponent] = React.useState<React.ComponentClass|React.FC>(() => () => null)
  const { pieces } = React.useContext(ChessboardContext)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && pieces[name]) {
      const eventListener = (e?: CustomEvent<{ component: React.ComponentClass|React.FC }>) => {
        if (e && e.detail && e.detail.component) {
          setComponent(() => e.detail.component)
        }
      }

      document.addEventListener<any>('ChessboardLoaded::' + name, eventListener)

      loadStyle(pieces[name], name)
        .then(() => loadScript(pieces[name], name))
        .catch(() => {
          console.error('"' + name + '" not found. Did you launch it?')
        })

      return () => document.removeEventListener<any>('ChessboardLoaded::' + name, eventListener)
    }
  }, [name])

  return React.createElement(
    React.Fragment,
    {},
    React.createElement('div',
      {
        'data-hypernova-key': name,
        'data-hypernova-id': id,
      },
      React.createElement(Component, props)
    ),
    React.createElement('script', {
      'type': 'application/json',
      'data-hypernova-key': name,
      'data-hypernova-id': id,
      'dangerouslySetInnerHTML': {__html: `${JSON.stringify(props)}`},
    })
  )
}


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
