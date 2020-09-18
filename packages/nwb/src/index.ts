// Node imports
import path from 'path'
import fs from 'fs'
import cProcess from 'child_process'

// Webpack imports
import webpack, { ContextReplacementPlugin } from 'webpack'
import ChessboardPatchOutputPlugin from './patch-output-plugin'
import NodemonPlugin from 'nodemon-webpack-plugin'

import fp from 'find-free-port'
import { ChessboardSSRDev } from '@chessboard/ssr-development'

function ChessboardDev(name: string, htmlPlugins: webpack.Plugin[], originalConf: webpack.Configuration) {
  const root = process.env.INIT_CWD || process.env.PWD!
  const src = path.resolve(root, './src')
  const index = path.resolve(src, './index.dev')
  const valid = fs.existsSync(index + '.js')
    || fs.existsSync(index + '.jsx')
    || fs.existsSync(index + '.ts')
    || fs.existsSync(index + '.tsx')

  if(!valid) {
    throw new Error('src/index.dev.js(|jsx|ts|tsx) not found')
  }
  const webpackConf = {
    ...originalConf,
    output: {
      ...originalConf.output!,
    },
    plugins: [...originalConf.plugins!],
    module: {
      ...(originalConf.module || []),
      rules: [...originalConf.module!.rules],
    }
  }

  delete webpackConf.externals
  webpackConf.output!.chunkFilename = name + '.[name].js'
  webpackConf.output!.filename = 'dev.js'
  webpackConf.entry = { dev: index }
  webpackConf.plugins.push(...htmlPlugins)

  return webpackConf
}

function ChessboardSSR(originalConf : webpack.Configuration) {
  const root = process.env.INIT_CWD || process.env.PWD!
  const src = path.resolve(root, './src')
  const index = path.resolve(src, './index')
  const valid = fs.existsSync(index + '.js')
    || fs.existsSync(index + '.jsx')
    || fs.existsSync(index + '.ts')
    || fs.existsSync(index + '.tsx')

  const webpackConf = {
    ...originalConf,
    output: {
      ...originalConf.output!,
    },
    plugins: [...originalConf.plugins!],
    module: {
      ...(originalConf.module || []),
      rules: [...originalConf.module!.rules],
    }
  }

  if(!valid) {
    throw new Error('src/index.js(|jsx|ts|tsx) not found')
  }

  webpackConf.target = 'node'
  webpackConf.resolve = {
    ...(webpackConf.resolve || {}),
    alias: {
      ...(webpackConf.resolve && webpackConf.resolve.alias || {}),
      ['@chessboard/piece']: '@chessboard/ssr',
    }
  }
  webpackConf.output.filename = 'server.js'
  webpackConf.output.path = path.resolve(root, './dist')
  webpackConf.stats = {
    warningsFilter: [/critical dependency:/i],
  }
  delete webpackConf.externals
  delete webpackConf.output.chunkFilename
  delete webpackConf.optimization
  webpackConf.devtool = false

  if (process.env.NODE_ENV === 'production') {
    webpackConf.entry = index

    webpackConf.plugins.splice(0, 1)
    webpackConf.plugins.splice(3, 2)
    webpackConf.plugins.splice(3, 3)

    webpackConf.plugins.push(
      new ContextReplacementPlugin(
        /^\.$/,
        (context : any) => {
          if (/\/node_modules\/(hypernova|express|colors)/.test(context.context)) {//ensure we're only doing this for modules we know about
            context.regExp = /this_should_never_exist/
            for (const d of context.dependencies) {
              if (d.critical) d.critical = false;
            }
          }
        }
      )
    )

    webpackConf.module.rules = webpackConf.module.rules.map((r) => {
      // Find the css rule
      const loaders = [r.loader, ...(Array.isArray(r.use) ? r.use : [r.use]||[]).map((u) => u && (u as any).loader)]
      if(loaders.find((l) => l && l.includes('css-loader'))) {
        return {
          test: r.test,
          use: 'null-loader',
        }
      }

      return r
    })
  } else {
    webpackConf.watch = true
    webpackConf.entry = index

    webpackConf.plugins.splice(0, 1)
    webpackConf.plugins.splice(3, 1)
    webpackConf.plugins.splice(4, 3)

    webpackConf.plugins.push(
      new ContextReplacementPlugin(
        /^\.$/,
        (context : any) => {
          if (/\/node_modules\/(hypernova|express|colors)/.test(context.context)) {//ensure we're only doing this for modules we know about
            context.regExp = /this_should_never_exist/
            for (const d of context.dependencies) {
              if (d.critical) d.critical = false;
            }
          }
        }
      )
    )
    webpackConf.plugins.push(new NodemonPlugin({
      script: './dist/server.js',
      verbose: false,
      watch: path.resolve(root, './dist') as any,
    }))

    webpackConf.module.rules = webpackConf.module.rules.map((r) => {
      // Find the css rule
      const loaders = [r.loader, ...(Array.isArray(r.use) ? r.use : [r.use]||[]).map((u) => u && (u as any).loader)]
      if(loaders.find((l) => l && l.includes('css-loader'))) {
        return {
          test: r.test,
          use: 'null-loader',
        }
      }

      return r
    })
  }

  return webpackConf
}

module.exports.ChessboardNwb = function ({
  name,
  port = 3001,
  config = {},
  externals = {},
  publicUrl = '/',
} : {
  name : string,
  port: number
  config?: any
  externals?: {[key: string]: string}
  publicUrl?: string
} = { port: 3001, name: '' }) {
  if(!name) {
    throw new Error('You must provide a name for your Piece!')
  }

  const root = process.env.INIT_CWD || process.env.PWD!
  const src = path.resolve(root, './src')
  const index = path.resolve(src, './index')
  const dev = path.resolve(src, './index.dev')

  const hasIndex = fs.existsSync(index + '.js')
    || fs.existsSync(index + '.jsx')
    || fs.existsSync(index + '.ts')
    || fs.existsSync(index + '.tsx')
  const hasDev = fs.existsSync(dev + '.js')
    || fs.existsSync(dev + '.jsx')
    || fs.existsSync(dev + '.ts')
    || fs.existsSync(dev + '.tsx')

  if(!hasIndex) {
    throw new Error('src/index.js(|jsx|ts|tsx) not found')
  }

  config.type = 'react-app'

  config.babel = config.babel || {}
  config.webpack = config.webpack || {}
  config.devServer = config.devServer || {}

  // Configure Babel
  const oldBabelConfig = config.babel.config || ((c: any) => c)
  config.babel.config = function config(conf: any) {
    const babelConf = oldBabelConfig(conf)

    // Disable React Refresh, which does not work correctly with MicroFrontend injections
    const reactRefreshIndex = babelConf.plugins.findIndex(([p] : [string]) => p.indexOf('react-refresh') > -1)
    babelConf.plugins.splice(reactRefreshIndex, 1)

    return babelConf
  }

  // Configure Webpack
  const oldWebpackConfig = config.webpack.config || ((c: any) => c)

  config.webpack.rules = {
    ...(config.webpack.rules || {}),
    babel: {
      ...(config.webpack.rules && config.webpack.rules.babel || {}),
      test: /.(jsx?|tsx?)$/
    }
  }
  config.webpack.define = {
    ...(config.webpack.define || {}),
    'process.env.CHESSBOARD_PIECE': JSON.stringify(name)
  }
  config.webpack.config = function config(conf: webpack.Configuration) {
    const webpackConf : webpack.Configuration = oldWebpackConfig(conf)

    webpackConf.output!.chunkFilename = name + '.[name].js'
    webpackConf.output!.filename = 'client.js'

    webpackConf.externals = {
      ...externals,
      'react': 'React',
      'react-dom': 'ReactDOM',
    }

    webpackConf.resolve = {
      ...(webpackConf.resolve || {}),
      extensions: [
        ...(webpackConf.resolve && webpackConf.resolve.extensions || []),
        '.js', '.jsx', '.ts', '.tsx',
      ]
    }

    let htmlPlugins : webpack.Plugin[] = []
    if (process.env.NODE_ENV === 'production') {
      delete webpackConf.optimization!.splitChunks
      webpackConf.output!.publicPath = publicUrl
      webpackConf.entry = { client: index }
      webpackConf.optimization = { noEmitOnErrors: true, runtimeChunk: 'single' }

      // Patch CSS output plugin
      ;(webpackConf.plugins![3] as any).options.chunkFilename = name + '.client.css'
      ;(webpackConf.plugins![3] as any).options.filename = 'client.css'

      // Inject custom patching plugin
      webpackConf.plugins!.unshift(new ChessboardPatchOutputPlugin(name))
    } else {
      webpackConf.output!.publicPath = 'http://localhost:' + port + '/'

      webpackConf.entry = { client: index }

      // Remove ReactRefresh plugin
      webpackConf.plugins!.splice(4, 1)

      // Inject custom patching plugin
      webpackConf.plugins!.unshift(new ChessboardPatchOutputPlugin(name))

      // Remove HTML plugins
      htmlPlugins = webpackConf.plugins!.splice(6, 2)

      fp(30000, 40000)
        .then(([p] : [string]) => {
          process.env.SSR_PORT = p
          const ssrConfig = ChessboardSSR(webpackConf)

          ChessboardSSRDev(ssrConfig)
        })
    }

    if(process.env.NODE_ENV === 'production') {
      return [webpackConf, ChessboardSSR(webpackConf)]
    }

    if(hasDev && process.env.NODE_ENV === 'development') {
      return [ChessboardDev(name, htmlPlugins, webpackConf), webpackConf]
    }

    return webpackConf
  }

  // Configure DevServer
  const router = () => {
    return 'http://localhost:' + process.env.SSR_PORT
  }
  config.devServer.port = port
  config.devServer.sockPort = port
  config.devServer.proxy = {
    ...(config.devServer.proxy || {}),
    '/batch': {
      target: '/',
      router,
    }
  }

  return config
}
