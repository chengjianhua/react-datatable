var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src/DataTable/index.js'),
    path.join(__dirname, 'src/DataTable/index.scss')
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js'
  },
  plugins: [
    new ExtractTextPlugin('react-datatable.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: [path.join(__dirname, 'src')],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      }
    ]
  }
};
