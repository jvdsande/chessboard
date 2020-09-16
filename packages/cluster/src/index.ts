// Node imports
import fs from 'fs'
import path from 'path'

// Express imports
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'

// Other imports
import axios from 'axios'


export default async function () {
  const f = process.argv[2] || './chessboard-pieces.json'
  const p = process.env.PORT || 8081

  let file = null
  try {
    file = fs.readFileSync(f, 'utf-8')
  } catch(err) {}

  const views = JSON.parse(file || '{}')

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())

  Object.keys(views)
    .forEach(view => {
      app.get(path.join('/script/', view + '.js'), (req, res) => {
        if(!views[view]) {
          res.status(404)
          return res.send('')
        }

        const [protocol, url] = views[view].split('://')
        res.contentType('application/javascript; charset=utf-8')

        const getMainJs = axios.get(protocol + '://' + path.join(url, view + '.client.js'))
          .catch(() => ({ data: '' }))
        const getBundleJs = axios.get(protocol + '://' + path.join(url, 'client.js'))

        Promise.all([
          getMainJs,
          getBundleJs,
        ])
          .then(([{ data: main }, { data: bundle }]) => {
            res.send(main + '\n\n' + bundle)
          })
          .catch(() => {
            res.status(404)
            res.send('')
          })
      })

      app.get(path.join('/style/', view + '.css'), (req, res) => {
        if(!views[view]) {
          return res.send('')
        }

        const [protocol, url] = views[view].split('://')
        res.contentType('text/css; charset=utf-8')

        const getMainCss = axios.get(protocol + '://' + path.join(url, view + '.client.css'))
          .catch(() => ({ data: '' }))
        const getBundleCss = axios.get(protocol + '://' + path.join(url, 'client.css'))
          .catch(() => ({ data: '' }))

        Promise.all([
          getMainCss,
          getBundleCss,
        ])
          .then(([{ data: main }, { data: bundle }]) => {
            res.send(main + '\n\n' + bundle)
          })
          .catch(() => {
            res.send('')
          })
      })
    })

  app.use(createProxyMiddleware('/batch', {
    target: '/batch',
    changeOrigin: true,
    router: (req) => {
      const name = req && req.body && req.body.uuid && req.body.uuid.name

      if(name && views[name]) {
        const [protocol, url] = views[name].split('://')
        return protocol + '://' + path.join(url)
      }
      return ''
    },
  }))

  app.listen(Number(p), '0.0.0.0', () => {
    console.log('Server ready on http://localhost:' + p)
  })
}

