var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // 'webpack-dev-server/client?http://localhost:8080',
    // 'webpack/hot/only-dev-server',
    './src/index.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.(gif|jpg|png|mp3|aac|ogg)$/,
        loader: 'file-loader'
      }
    ]
  },

  devServer: {
    historyApiFallback: true
    // hot: true
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
