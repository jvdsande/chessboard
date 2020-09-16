import React from 'react'
import { v4 } from 'uuid'

import {ChessboardExternals} from '@chessboard/externals'

const {window, document} = global

const PROXY_HOST = 'http://localhost:8081'

ChessboardExternals()

function loadScript(name: string) {
  const src = PROXY_HOST + '/script/' + name + '.js'

  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[src="'.concat(src, '"]'))) {
      resolve()
      return
    }

    const el = document.createElement('script')
    el.type = 'text/javascript'
    el.async = true
    el.src = src
    el.addEventListener('load', resolve)
    el.addEventListener('error', reject)
    el.addEventListener('abort', reject)
    document.head.appendChild(el)
  })
}

function loadStyle(name: string) {
  const src = PROXY_HOST + '/style/' + name + '.css'

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

export function ChessboardSquare({name, props} : { name: string, props: any}) {
  const [id] = React.useState(() => v4())
  const [Component, setComponent] = React.useState<React.ComponentClass|React.FC>(() => () => null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const eventListener = (e?: CustomEvent<{ component: React.ComponentClass|React.FC }>) => {
        if (e && e.detail && e.detail.component) {
          setComponent(() => e.detail.component)
        }
      }

      document.addEventListener<any>('ChessboardLoaded::' + name, eventListener)

      loadStyle(name)
        .then(() => loadScript(name))
        .then(() => eventListener())
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
