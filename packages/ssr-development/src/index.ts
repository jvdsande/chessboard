import webpack from 'webpack'
// @ts-ignore
import logging from 'webpack/lib/logging/runtime'

export function ChessboardSSRDev(config : webpack.Configuration) {
  logging.configureDefaultLogger({
    level: 'error',
  })

  webpack(config, () => {})
}
