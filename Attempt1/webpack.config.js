'use strict'
const path = require('path')

//const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',

  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.bundle.js',
    publicPath: '/',
  },

  devServer: {
    contentBase: './public',
    compress: true,
    port: 9000,
  },

  // plugins: [
  //   new ServerMiniCssExtractPlugin({
  //     // Options similar to the same options in webpackOptions.output
  //     // all options are optional
  //     filename: 'style.css',
  //     chunkFilename: '[id].css',
  //     //ignoreOrder: false, // Enable to remove warnings about conflicting order
  //   }),
  // ],

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env'
              ],
            ],
          },
        }],
      },

      // {
      //   test: /\.noemit\.scss$/,
      //   use: [
      //     ServerMiniCssExtractPlugin.loader,
      //     loaders.css({ modules: true }),
      //     loaders.postCss(),
      //     loaders.sass(),
      //   ],
      // },
      // {
      //   test: /\.scss$/,
      //   exclude: [/\.noemit\.scss$/],
      //   use: [
      //     loaders.extractCss(),
      //     loaders.css({ modules: true }),
      //     loaders.postCss(),
      //     loaders.sass(),
      //   ],
      // },

    ],
  },
}
