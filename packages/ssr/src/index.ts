import path from 'path'
import React from 'react'
import {renderReact} from 'hypernova-react'
import hypernova from 'hypernova/server'
import express from 'express'

export function ChessboardPiece(component: React.ComponentClass|React.FC) {
  return hypernova({
    devMode: process.env.NODE_ENV !== 'production',
    port: process.env.SSR_PORT || 30000,
    getCPUs() {
      return 1
    },
    logger: {
      silent: true,
    },

    getComponent(n: string) {
      if(n !== process.env.CHESSBOARD_PIECE) {
        return null
      }

      return renderReact(name, component)
    },
    createApplication() {
      const app = express();

      app.use('/', express.static(path.join(process.cwd(), 'dist')));

      return app;
    },
  })
}
