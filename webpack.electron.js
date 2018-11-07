const path = require('path');

module.exports = {
  target: 'electron-main',
  entry: {
    index: './src/main/index.ts'
  },
  // node: {
  //   __dirname: true
  // },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "src/renderer")
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/main')
  },
}
