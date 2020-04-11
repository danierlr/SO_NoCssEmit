'use strict'
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function recursiveIssuer(module) {
  if (module.issuer) {
    return recursiveIssuer(module.issuer);
  } else if (module.name) {
    return module.name;
  } else {
    return false;
  }
}

module.exports = {
  mode: 'development',

  entry: {
    app: "./src/index.js"
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: "[name].js",
    chunkFilename: "[id].js",
    publicPath: '/',
  },

  devServer: {
    contentBase: './public',
    compress: true,
    port: 9000,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    })
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

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          chunks: "all",

          // test: (module, chunks, entry = 'styles') => {
          //   if(module.constructor.name == "CssModule"){
          //     console.log('aaa', module, chunks)
          //   }
            
          //   return module.constructor.name == "CssModule";
          // },

          test: /\.s?css$/,


          enforce: true
        },
      }
    }
  }
}
