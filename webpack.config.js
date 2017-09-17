module.exports = {
  entry: {
    app: __dirname + '/src/client.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: "./js/[name].bundle.js"
  }
}