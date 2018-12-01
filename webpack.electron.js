const path = require('path');

module.exports = {
  watch: true,
  target: 'electron-main',
  node: {
    __filename: true,
    __dirname: true
  },
  entry: {
    index: './src/main/index.ts',
    worker: './src/main/database/child.ts',
  },
  // node: {
  //   __dirname: true
  // },
  devtool: 'eval-sourcemap',
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
