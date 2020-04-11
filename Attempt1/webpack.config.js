'use strict'
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// remove spam caused by mini-extract-css-plugin
class CleanUpStatsPlugin {
  shouldPickStatChild(child) {
    return child.name.indexOf('mini-css-extract-plugin') !== 0
  }

  apply(compiler) {
    compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
      const children = stats.compilation.children
      if (Array.isArray(children)) {
        // eslint-disable-next-line no-param-reassign
        stats.compilation.children = children.filter((child) =>
          this.shouldPickStatChild(child)
        )
      }
    })
  }
}

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

  plugins: [
    new CleanUpStatsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
  ],

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

      {
        test: /\.noemit\.scss$/,
        use: [
          //MiniCssExtractPlugin.loader, // after disabling this, it started to work
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                exportGlobals: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                context: path.resolve(__dirname, 'src'),
                hashPrefix: '_',
              },
              importLoaders: 2,
              onlyLocals: true, // setting this to true causes transpilation to crash
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            },
          },
          {
            loader: 'sass-loader',
            options: {
            },
          },
        ],
      },

      {
        test: /\.scss$/,
        exclude: [/\.noemit\.scss$/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                exportGlobals: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                context: path.resolve(__dirname, 'src'),
                hashPrefix: '_',
              },
              importLoaders: 2,
              onlyLocals: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            },
          },
          {
            loader: 'sass-loader',
            options: {
            },
          },
        ],
      },

    ],
  },
}
