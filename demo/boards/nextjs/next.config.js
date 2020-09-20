const withSass = require('@zeit/next-sass')
module.exports = withSass({
  devIndicators: {
    autoPrerender: false,
  },
})
