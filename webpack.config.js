const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

  watch: true,

  target: 'electron-renderer',

  entry: {
    ui: './src/renderer/index.tsx'
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  mode: process.env.ENV || 'development',

  output: {
    filename: '[name].js',
    path: __dirname + '/dist/renderer'
  },
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.ts$/,
      //   enforce: 'pre',
      //   loader: 'tslint-loader',
      // },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist/renderer'], {
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      hash: true,
      inject: 'body',
      template: './public/index.html',
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  }

}
