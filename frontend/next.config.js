const withAntdLess = require('next-plugin-antd-less')

module.exports = withAntdLess({
  webpack(config) {
    return config
  },

  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
})
