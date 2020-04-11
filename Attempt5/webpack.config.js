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

  devtool: 'inline-source-map',

  entry: {
    app: "./src/index.js"
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js",
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
      filename: "[name].css",
      chunkFilename: "[id].css"
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

      // {
      //   test: /\.noemit\.scss$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: {
      //           mode: 'local',
      //           exportGlobals: true,
      //           localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //           context: path.resolve(__dirname, 'src'),
      //           hashPrefix: '_',
      //         },
      //         importLoaders: 2,
      //       },
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         plugins: () => [require('autoprefixer')]
      //       },
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //       },
      //     },
      //   ],
      // },

      {
        test: /\.scss$/,
        //exclude: [/\.noemit\.scss$/],
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
        default: false,
        groupUnusedStyles: {
          name: "unusedStyles",
          chunks: "all",

          // test: (module, chunks, entry = 'styles') => {
          //   if(module.constructor.name == "CssModule"){
          //     console.log('aaa', module, chunks)
          //   }
            
          //   return module.constructor.name == "CssModule";
          // },

          test: /\.noemit\.scss$/,

          //priority: 10,

          // in case enforce is false app.css contains all the styles, which is  unwanted
          // in case enforce is true everything is fine except that no console output is visible if './styles.noemit.scss' is included in index.js
          enforce: true
        },
        // groupUsedStyles: {
        //   name: "usedStyles",
        //   chunks: "all",

        //   // test: (module, chunks, entry = 'styles') => {
        //   //   if(module.constructor.name == "CssModule"){
        //   //     console.log('aaa', module, chunks)
        //   //   }
            
        //   //   return module.constructor.name == "CssModule";
        //   // },

        //   test: /\.scss$/,

        //   //priority: 0,

        //   // in case enforce is false app.css contains all the styles, which is  unwanted
        //   // in case enforce is true everything is fine except that no console output is visible if './styles.noemit.scss' is included in index.js
        //   enforce: false
        // },
      }
    }
  }
}
