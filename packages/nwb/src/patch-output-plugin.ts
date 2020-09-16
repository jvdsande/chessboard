import path from 'path'
import webpack from 'webpack'

export default class ChessboardPatchOutputPlugin {
  view: string

  constructor(view : string) {
    this.view = view
  }

  apply(compiler : webpack.Compiler) {
    const { view } = this

    compiler.hooks.emit.tap('shouldEmit', (compilation) => {
      for (const filename in compilation.assets) {
        const ext = path.extname(filename).replace(/(\?)(.){0,}/, '')

        if(ext === '.js') {
          const asset = compilation.assets[filename]

          const content = asset.source()

          if(typeof content !== 'string') {
            continue
          }

          const patched = content
            // Patch React-Refresh to isolate scope
            .replace(/\$RefreshReg\$/g, '$RefreshReg' + view)
            .replace(/\$RefreshSig\$/g, '$RefreshSig' + view)
            .replace(/\$RefreshSetup\$/g, '$RefreshSetup' + view)

            // Patch Webpack related globals
            .replace(/webpackJsonp/g, 'webpackJsonp' + view)
            .replace(/webpackHotUpdate/g, 'webpackHotUpdate' + view)

            // Avoid any window reload
            // .replace(/window\.location\.reload\(\)/g, '')
            // .replace(/rootWindow\.location\.reload\(\)/g, '')
            // .replace(/self\.location\.reload\(\)/g, '')

          asset.source = () => patched
        }
      }

      return true
    })
  }
}

