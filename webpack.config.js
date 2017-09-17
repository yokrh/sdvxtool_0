const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractTextPlugin = new ExtractTextPlugin('./css/[name].css');

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
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-nested')(),
                  require('autoprefixer')({browsers: ['last 2 versions']}),
                  require('cssnano')()
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        loader: 'file-loader?name=img/[name].[ext]'
      }
    ]
  },
  plugins: [extractTextPlugin],
  output: {
    path: __dirname + '/dist',
    filename: "./js/[name].bundle.js"
  }
}